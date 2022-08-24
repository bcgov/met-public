File name: Dockerfile
Comment: Changes made to fix the build error, Line 75
existing: && curl "$databricks_odbc_driver_url" --output /tmp/simba_odbc.zip \
changed: && curl "$databricks_odbc_driver_url" --location --output /tmp/simba_odbc.zip \


File name: client/app/assets/less/inc/variables.less
Comment: Changes made to standard BC Fonts, Line 44
existing: @redash-font:                            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
changed: @redash-font:                           'BCSans', 'Noto Sans', Verdana, Arial, sans-serif;


File name: client/app/components/QueryLink.jsx
Comment: Changes made to remove the query name from the visualization title, Line 28
existing: <VisualizationName visualization={visualization} /> <span>{query.name}</span>
changed: <VisualizationName visualization={visualization} />


File name: client/app/components/visualizations/VisualizationName.less
Comment: Changes made to remove the '-' from the visualization title, Line 7
existing: content: "−";
changed: Deleted the code


File name: client/app/pages/dashboards/DashboardPage.less
Comment: Added code for standard BC Fonts, Line 9
existing: No existing code
changed: font-family: 'BCSans', 'Noto Sans', Verdana, Arial, sans-serif;


File name: client/app/pages/dashboards/PublicDashboardPage.jsx
Comment: Removed the dashboard header from public dashboard, Lines 29 to 34
existing: <PageHeader title={dashboard.name} />
      {!isEmpty(globalParameters) && (
        <div className="m-b-10 p-15 bg-white tiled">
          <Parameters parameters={globalParameters} onValuesChange={refreshDashboard} />
        </div>
      )}
Comment: Removed the dashboard footer from public dashboard, Lines 91 to 98
existing: <div id="footer">
          <div className="text-center">
            <Link href="https://redash.io">
              <img alt="Redash Logo" src={logoUrl} width="38" />
            </Link>
          </div>
          Powered by <Link href="https://redash.io/?ref=public-dashboard">Redash</Link>
        </div>
changed: Deleted the code


File name: client/app/pages/dashboards/PublicDashboardPage.less
Comment: Added code for standard BC Fonts, Line 2
existing: No existing code
changed: font-family: 'BCSans', 'Noto Sans', Verdana, Arial, sans-serif; 
Comment: Removed the code for minimum height, Line 11
existing: min-height: calc(100vh - 95px);
changed: commented the code 
Comment: Changed the public dashboard background to white, Line 13 
existing: No existing code
changed: background: #ffffff; 


File name: viz-lib/src/visualizations/ColorPalette.ts
Comment: Removed the existing default colors and added the standard colors as per the design
existing: 
export const BaseColors = {
  Blue: "#356AFF",
  Red: "#E92828",
  Green: "#3BD973",
  Purple: "#604FE9",
  Cyan: "#50F5ED",
  Orange: "#FB8D3D",
  "Light Blue": "#799CFF",
  Lilac: "#B554FF",
  "Light Green": "#8CFFB4",
  Brown: "#A55F2A",
  Black: "#000000",
  Gray: "#494949",
  Pink: "#FF7DE3",
  "Dark Blue": "#002FB4",
};
// Additional colors for the user to choose from
export const AdditionalColors = {
  "Indian Red": "#981717",
  "Green 2": "#17BF51",
  "Green 3": "#049235",
  "Dark Turquoise": "#00B6EB",
  "Dark Violet": "#A58AFF",
  
changed: 
export const BaseColors = {
  "Tahiti Gold": "#F0860B",
  "Silver Chalice": "#ACA9A9",
  "Midnight Blue": "#003366",
  "Dove Gray": "#707070",
  "Web Orange": "#FFAB00",
  "Steel Blue": "#4C81AF",
  "Fiord": "#455A64",
  "Light Apricot": "#FCD5A8",
  Stratos: "#000C3B",
  Geyser: "#CFD8DC",
  Matisse: "#1A5A96",
  Amber: "#FFC107",
  Chambray: "#385989",
  Tundora: "#494949",
  "Light Blue": "#799CFF",
  "Dark Blue": "#002FB4",
};

// Additional colors for the user to choose from
export const AdditionalColors = {
  Salomie: "#FFE082",
  Shark: "#313132",
  "Green 3": "#049235",
  "Dark Turquoise": "#00B6EB",
  "Dark Violet": "#A58AFF",


File name: viz-lib/src/visualizations/chart/plotly/prepareDefaultData.ts
Comment: Changes made to remove tooltip functionality on bar charts, Line 20
existing: No existing code
changed: series.hoverinfo = "skip";


File name: viz-lib/src/visualizations/chart/plotly/prepareLayout.ts
Comment: Added code for standard BC Fonts, line 122 to 123
existing: No existing code
changed: 
      "font": {
        "family": "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif"
      },
    },
    font: {
      family: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
      size: 13,