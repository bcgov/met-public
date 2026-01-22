"""
Engagement Load Testing
=============================================

This locustfile defines multiple user behaviors to simulate realistic and heavy load patterns
on both the web frontend and API endpoints of the Engagement platform.

USER CLASS WEIGHTS:
- RealisticAPIUser (weight=70): Primary load generator for production-like API testing
- RealisticFrontendUser (weight=30): Secondary load for frontend/browsing patterns
- HeavyAPIUser (weight=1): Minimal default weight; select in UI for stress testing
- HeavyFrontendUser (weight=1): Minimal default weight; select in UI for stress testing

Default behavior runs realistic users. Use Locust UI class picker to enable heavy stress tests.

See README.md for details on usage and configuration.
"""

from locust import HttpUser, task, between, events, tag  # type: ignore
import random


def GET(url, name=None, annotation=None):
    """Helper to format GET request names with optional annotation"""
    if name is None:
        name = f"/GET {url}"
    if annotation:
        name += f" ({annotation})"
    return name


JSON_CONTENT_TYPE = "application/json"
HOMEPAGE_NAME = GET("/", annotation="HTML")
CONFIG_JS_URL = "/config/config.js"
FAVICON_URL = "/BCFavIcon.png"
MANIFEST_URL = "/manifest.json"

# ============================================================================
# REALISTIC API USER - Production-Like API Patterns
# ============================================================================


@tag('realistic', 'api', 'production')
class RealisticAPIUser(HttpUser):
    """
    REALISTIC API USER - Production-Like Behavior

    Simulates actual user browsing patterns with realistic wait times.
    Use this for:
    - Production load estimation
    - Capacity planning
    - Realistic performance testing
    - Mixed load scenarios

    Characteristics:
    - Human-like wait times (2-5s)
    - Follows typical user journey
    - Browses -> Searches -> Views details
    - Caches and reuses data

    NOTE: Enabled by default (weight=70). This is the primary load generator.
    """
    weight = 70  # 70% of default realistic load
    wait_time = between(2, 5)

    engagement_cache = []
    slug_cache = []

    def on_start(self):
        """User lands on site - initial browse"""
        self.headers = {
            "Content-Type": JSON_CONTENT_TYPE,
            "Accept": JSON_CONTENT_TYPE,
            "tenant-id": "GDX"
        }
        # Initial landing page data load
        self._load_engagement_list(page=1)

    def _load_engagement_list(self, page=1):
        """Load engagement list (landing page)"""
        with self.client.get(
            f"/api/engagements?page={page}&size=10&sort_key=engagement.created_date&sort_order=desc&include_banner_url=true",
            headers=self.headers,
            name=GET("/api/engagements", annotation="paginated"),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    items = data.get('items', [])
                    for item in items:
                        if item.get('id') and item['id'] not in self.engagement_cache:
                            self.engagement_cache.append(item['id'])
                        if item.get('slug') and item['slug'] not in self.slug_cache:
                            self.slug_cache.append(item['slug'])
                    response.success()
                except Exception as e:
                    response.failure(f"Parse failed: {e}")

    @task(15)
    def browse_engagements(self):
        """Browse engagement list (most common action)"""
        page = random.randint(1, 3)
        self._load_engagement_list(page=page)

    @task(10)
    def view_engagement_by_slug(self):
        """View engagement details (typical user flow)"""
        if not self.slug_cache:
            return

        slug = random.choice(self.slug_cache)
        with self.client.get(
            f"/api/engagementslugs/{slug}",
            headers=self.headers,
            name=GET("/api/engagementslugs/[slug]"),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    engagement_id = data.get('engagement_id')
                    if engagement_id:
                        # User views engagement details
                        self._view_engagement_details(engagement_id)
                    response.success()
                except Exception as e:
                    response.failure(f"Failed: {e}")

    def _view_engagement_details(self, engagement_id):
        """Load engagement and associated data (realistic cascade)"""
        # Main engagement data
        self.client.get(
            f"/api/engagements/{engagement_id}",
            headers=self.headers,
            name=GET("/api/engagements/[id]")
        )

        # User looks at widgets
        self.client.get(
            f"/api/widgets/engagement/{engagement_id}",
            headers=self.headers,
            name=GET("/api/widgets/engagement/[id]",
                     annotation="from engagement")
        )

        # Sometimes loads metadata
        if random.random() < 0.7:  # 70% of the time
            self.client.get(
                f"/api/engagements/{engagement_id}/metadata",
                headers=self.headers,
                name=GET("/api/engagements/[id]/metadata",
                         annotation="from engagement")
            )

        # Sometimes loads details tabs
        if random.random() < 0.5:  # 50% of the time
            self.client.get(
                f"/api/engagement/{engagement_id}/details",
                headers=self.headers,
                name=GET("/api/engagement/[id]/details",
                         annotation="from engagement")
            )

    @task(5)
    def search_engagements(self):
        """Search for engagements"""
        search_terms = ["community", "feedback",
                        "consultation", "planning", "project", "survey"]
        term = random.choice(search_terms)

        self.client.get(
            f"/api/engagements?page=1&size=10&search_text={term}&sort_key=engagement.created_date&sort_order=desc",
            headers=self.headers,
            name=GET("/api/engagements", annotation="search")
        )

    @task(3)
    def load_metadata_filters(self):
        """Load metadata taxon filters (for filtering UI)"""
        self.client.get(
            "/api/engagement_metadata/taxa/filters/",
            headers=self.headers,
            name=GET("/api/engagement_metadata/taxa/filters")
        )

    @task(2)
    def check_version(self):
        """Health check / version check"""
        self.client.get(
            "/api/version/",
            headers=self.headers,
            name=GET("/api/version")
        )


# ============================================================================
# REALISTIC FRONTEND USER - Production-Like Browsing
# ============================================================================

@tag('realistic', 'frontend', 'production')
class RealisticFrontendUser(HttpUser):
    """
    REALISTIC FRONTEND USER - Production-Like Browsing

    Simulates actual user browsing with realistic navigation patterns.
    Use this for:
    - Production traffic simulation
    - User experience testing
    - Combined with RealisticAPIUser for full stack testing

    Characteristics:
    - Realistic wait times (3-8s)
    - Typical browsing patterns
    - Occasional page reloads
    - Human-like navigation

    Note: After initial load, most requests are API calls (handled by RealisticAPIUser)

    NOTE: Enabled by default (weight=30). Complements RealisticAPIUser for full-stack testing.
    """
    weight = 30  # 30% of default realistic load
    wait_time = between(3, 8)

    slug_cache = []

    def on_start(self):
        """User lands on homepage"""
        # Initial HTML load
        self.client.get("/", name=HOMEPAGE_NAME)

        # Bootstrap assets
        self.client.get(CONFIG_JS_URL, name=GET(CONFIG_JS_URL))
        self.client.get("/api/oidc_config/config.js",
                        name=GET("/api/oidc_config/config.js"))
        self.client.get(FAVICON_URL, name=GET(FAVICON_URL))
        self.client.get(MANIFEST_URL, name=GET(MANIFEST_URL))
        # Discover routes
        self._discover_engagements()

    def _discover_engagements(self):
        """Discover available engagements"""
        response = self.client.get(
            "/api/engagements?page=1&size=10",
            headers={"Accept": JSON_CONTENT_TYPE},
            name=GET("/api/engagements")
        )
        if response.status_code == 200:
            try:
                data = response.json()
                for item in data.get('items', []):
                    if item.get('slug'):
                        self.slug_cache.append(item['slug'])
            except Exception as e:
                if type(e) in [KeyboardInterrupt, BaseException, SystemExit]:
                    raise e
                pass

    @task(10)
    def browse_homepage(self):
        """Return to homepage / refresh"""
        self.client.get("/", name=HOMEPAGE_NAME)

    @task(8)
    def browse_engagements_page(self):
        """Navigate to engagements list page"""
        self.client.get("/engagements", name=GET("/engagements"))

    @task(6)
    def view_engagement_page(self):
        """Navigate to an engagement detail page"""
        if not self.slug_cache:
            return

        slug = random.choice(self.slug_cache)
        self.client.get(
            f"/{slug}/en",
            name=GET("/[slug]/[lang]")
        )

    @task(3)
    def navigate_surveys(self):
        """Navigate to surveys page"""
        self.client.get("/surveys", name=GET("/surveys"))

    @task(2)
    def navigate_metadata(self):
        """Navigate to metadata page"""
        self.client.get("/metadata", name=GET("/metadata"))

    @task(1)
    def reload_page(self):
        """User refreshes current page"""
        # Simulate a refresh (reload static assets)
        self.client.get(CONFIG_JS_URL,
                        name=f"{GET(CONFIG_JS_URL)} (refresh)")


# ============================================================================
# HEAVY API USER - For HPA Tuning and Stress Testing
# ============================================================================

@tag('heavy', 'api', 'stress')
class HeavyAPIUser(HttpUser):
    """
    HEAVY API LOAD - Stress Test & HPA Tuning

    Hammers the API with high-frequency requests to find scaling limits.
    Use this user type in isolation to:
    - Determine HPA thresholds
    - Find database connection pool limits
    - Identify API bottlenecks
    - Test cache effectiveness

    Characteristics:
    - Very short wait times (0.1-1s)
    - Large data requests (high page sizes)
    - Deep pagination testing
    - Concurrent metadata and widget loads

    NOTE: Has minimal weight by default (weight=1). Select explicitly in UI for stress testing.
    """
    weight = 1  # Minimal weight - explicitly select this class in Locust UI for stress testing
    wait_time = between(0.1, 1)

    # Shared cache across all instances
    engagement_cache = []
    slug_cache = []

    def on_start(self):
        """Initialize with aggressive data loading"""
        self.headers = {
            "Content-Type": JSON_CONTENT_TYPE,
            "Accept": JSON_CONTENT_TYPE,
            "tenant-id": "GDX"
        }
        # Preload large dataset
        self._aggressive_load_engagements()

    def _cache_engagement_data(self, items):
        """Helper to cache engagement IDs and slugs from items list"""
        for item in items:
            if item.get('id') and item['id'] not in self.engagement_cache:
                self.engagement_cache.append(item['id'])
            if item.get('slug') and item['slug'] not in self.slug_cache:
                self.slug_cache.append(item['slug'])

    def _aggressive_load_engagements(self):
        """Load multiple pages rapidly to populate cache"""
        for page in range(1, 4):
            with self.client.get(
                f"/api/engagements?page={page}&size=50&sort_key=engagement.created_date&sort_order=desc&include_banner_url=true",
                headers=self.headers,
                name=GET("/api/engagements", annotation="large page"),
                catch_response=True
            ) as response:
                if response.status_code == 200:
                    try:
                        data = response.json()
                        items = data.get('items', [])
                        self._cache_engagement_data(items)
                        response.success()
                    except Exception as e:
                        response.failure(f"Parse failed: {e}")

    @task(20)
    def hammer_engagement_list(self):
        """Repeatedly hit engagement list with varying queries"""
        page = random.randint(1, 10)
        size = random.choice([20, 50, 100])
        self.client.get(
            f"/api/engagements?page={page}&size={size}&sort_key=engagement.created_date&sort_order=desc&include_banner_url=true",
            headers=self.headers,
            name=GET("/api/engagements", annotation="varied")
        )

    @task(15)
    def rapid_slug_lookups(self):
        """Rapid-fire slug lookups and cascading loads"""
        if not self.slug_cache:
            return

        slug = random.choice(self.slug_cache)
        with self.client.get(
            f"/api/engagementslugs/{slug}",
            headers=self.headers,
            name=GET("/api/engagementslugs/[slug]"),
            catch_response=True
        ) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    engagement_id = data.get('engagement_id')
                    if engagement_id:
                        # Immediately cascade all related loads
                        self._load_all_engagement_data(engagement_id)
                    response.success()
                except Exception as e:
                    response.failure(f"Failed: {e}")

    def _load_all_engagement_data(self, engagement_id):
        """Load all engagement data concurrently (in sequence due to Locust's sync nature)"""
        # Main engagement
        self.client.get(
            f"/api/engagements/{engagement_id}",
            headers=self.headers,
            name=GET("/api/engagements/[id]")
        )

        # Widgets
        self.client.get(
            f"/api/widgets/engagement/{engagement_id}",
            headers=self.headers,
            name=GET("/api/widgets/engagement/[id]",
                     annotation="from engagement")
        )

        # Metadata
        self.client.get(
            f"/api/engagements/{engagement_id}/metadata",
            headers=self.headers,
            name=GET("/api/engagements/[id]/metadata",
                     annotation="from engagement")
        )

        # Details tabs
        self.client.get(
            f"/api/engagement/{engagement_id}/details",
            headers=self.headers,
            name=GET("/api/engagement/[id]/details",
                     annotation="from engagement")
        )

    @task(10)
    def stress_metadata_endpoints(self):
        """Hammer metadata taxon filter endpoints"""
        self.client.get(
            "/api/engagement_metadata/taxa/filters/",
            headers=self.headers,
            name=GET("/api/engagement_metadata/taxa/filters")
        )

    @task(8)
    def stress_widget_loads(self):
        """Rapid widget loading"""
        if not self.engagement_cache:
            return

        engagement_id = random.choice(self.engagement_cache)
        self.client.get(
            f"/api/widgets/engagement/{engagement_id}",
            headers=self.headers,
            name=GET("/api/widgets/engagement/[id]")
        )

    @task(5)
    def stress_details_tabs(self):
        """Load details tabs repeatedly"""
        if not self.engagement_cache:
            return

        engagement_id = random.choice(self.engagement_cache)
        self.client.get(
            f"/api/engagement/{engagement_id}/details",
            headers=self.headers,
            name=GET("/api/engagement/[id]/details")
        )

    @task(3)
    def rapid_search_queries(self):
        """Search with various filters"""
        search_terms = ["community", "feedback",
                        "consultation", "planning", "project"]
        # Status IDs: 1=Draft, 2=Published, 3=Closed, 4=Scheduled, 5=Unpublished
        # Published, Draft, or Published+Scheduled
        statuses = [[2], [1], [2, 4]]

        status_list = random.choice(statuses)
        status_params = '&'.join(
            [f'engagement_status[]={s}' for s in status_list])

        self.client.get(
            f"/api/engagements?page=1&size=20&search_text={random.choice(search_terms)}&{status_params}",
            headers=self.headers,
            name=GET("/api/engagements", annotation="search")
        )


# ============================================================================
# HEAVY FRONTEND USER - For Frontend/CDN Testing
# ============================================================================

@tag('heavy', 'frontend', 'stress')
class HeavyFrontendUser(HttpUser):
    """
    HEAVY FRONTEND LOAD - Static Asset & Route Testing

    Aggressively loads HTML, static assets, and navigates routes.
    Use this to test:
    - Nginx/CDN performance
    - Static asset caching
    - HTML serving capacity
    - Route handling

    Characteristics:
    - Frequent route changes
    - Loads static assets repeatedly
    - Short wait times
    - High navigation frequency

    Note: Cannot easily simulate JS chunk loading without browser automation.
    For true chunk testing, use Playwright or similar.

    NOTE: Has minimal weight by default (weight=1). Select explicitly in UI for stress testing.
    """
    weight = 1  # Minimal weight - explicitly select this class in Locust UI for stress testing
    wait_time = between(0.5, 2)

    slug_cache = []

    def on_start(self):
        """Load initial page and discover routes"""
        self.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }

        # Initial page load
        self.client.get("/", name=HOMEPAGE_NAME, headers=self.headers)

        # Load bootstrap resources
        self._load_bootstrap_assets()

        # Discover engagements for route navigation
        self._discover_routes()

    def _load_bootstrap_assets(self):
        """Load initial static assets"""
        self.client.get(CONFIG_JS_URL, name=GET(CONFIG_JS_URL))
        self.client.get("/api/oidc_config/config.js",
                        name=GET("/api/oidc_config/config.js"))
        self.client.get("/BCFavIcon.png", name=GET("/BCFavIcon.png"))
        self.client.get("/manifest.json", name=GET("/manifest.json"))

    def _discover_routes(self):
        """Discover engagement slugs for navigation"""
        response = self.client.get(
            "/api/engagements?page=1&size=20",
            headers={"Accept": JSON_CONTENT_TYPE},
            name=GET("/api/engagements", annotation="discovery")
        )
        if response.status_code == 200:
            try:
                data = response.json()
                for item in data.get('items', []):
                    if item.get('slug') and item['slug'] not in self.slug_cache:
                        self.slug_cache.append(item['slug'])
            except Exception as e:
                if type(e) in [KeyboardInterrupt, BaseException, SystemExit]:
                    raise e
                pass

    @task(20)
    def rapid_route_navigation(self):
        """Navigate between routes rapidly"""
        routes = [
            "/",
            "/engagements",
            "/surveys",
            "/metadata",
        ]

        if self.slug_cache:
            # Add some engagement routes
            slug = random.choice(self.slug_cache)
            routes.extend([
                f"/{slug}/en",
                f"/engagements/{random.randint(1, 50)}/view/en",
            ])

        route = random.choice(routes)
        self.client.get(route, headers=self.headers,
                        name=fGET("{route if len(route) < 30 else '[route]'}"))

    @task(10)
    def reload_static_assets(self):
        """Repeatedly load static assets (tests caching)"""
        assets = [
            CONFIG_JS_URL,
            "/BCFavIcon.png",
            "/manifest.json",
        ]
        asset = random.choice(assets)
        self.client.get(asset, name=fGET("{asset}"))

    @task(5)
    def load_engagement_route(self):
        """Load engagement detail routes"""
        if not self.slug_cache:
            return

        slug = random.choice(self.slug_cache)
        self.client.get(
            f"/{slug}/en",
            headers=self.headers,
            name=GET("/[slug]/[lang]")
        )


# ============================================================================
# Event Handlers - Useful for debugging
# ============================================================================

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Runs once when test starts"""
    print("\n" + "="*80)
    print("ENGAGEMENT LOAD TESTING STARTED")
    print("="*80)
    print(f"Host: {environment.host}")
    print(f"User classes: {[u.__name__ for u in environment.user_classes]}")
    print("="*80 + "\n")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Runs once when test stops"""
    print("\n" + "="*80)
    print("ENGAGEMENT LOAD TESTING COMPLETED")
    print("="*80 + "\n")
