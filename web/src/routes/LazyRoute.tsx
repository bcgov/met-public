import React from 'react';
import { Route, RouteProps } from 'react-router';

// Props of Route that must be defined statically (cannot be lazy)
type ImmutableRouteKey = 'lazy' | 'caseSensitive' | 'path' | 'id' | 'index' | 'children';
// Props of Route that *can* be lazily resolved
type LazyCapableProps = Omit<RouteProps, ImmutableRouteKey>;
// Keys of RouteProps that can be lazily resolved
type LazyCapableKey = keyof LazyCapableProps;
// Resulting type after resolving lazy props
type LazyResult = Partial<Record<LazyCapableKey, LazyCapableProps[LazyCapableKey]>>;
// Represents some module with a default export
type ModuleWithDefault<T> = { default: T } & Record<string, unknown>;
type LazyResolvable<T> = T | ModuleWithDefault<T>;
type LazyResolver<T> = () => Promise<LazyResolvable<T>>;
type ExtractLazyReturn<T> = T extends (...args: never[]) => Promise<infer TResult> ? TResult : never;
type LazyResolvedRoute = ExtractLazyReturn<Exclude<RouteProps['lazy'], undefined>>;

type LazyRouteLazyProps = {
    // Construct prop names from lazyCapableKeys
    // e.g. Component => ComponentLazy
    [K in LazyCapableKey as `${K}Lazy`]?: LazyResolver<LazyCapableProps[K]>;
};

type LazyRouteProps = Omit<RouteProps, 'children'> & {
    children?: React.ReactNode;
} & LazyRouteLazyProps;

const unwrapDefault = <T,>(value: LazyResolvable<T>): T => {
    if (value && typeof value === 'object' && 'default' in (value as Record<string, unknown>)) {
        return (value as ModuleWithDefault<T>).default;
    }
    return value as T;
};

// A factory function to create a Route element from LazyRouteProps
const createRouteFromLazyProps = ({ ...routeProps }: LazyRouteProps): React.ReactElement => {
    // List of possible lazy resolvers
    const lazyResolvers: Array<[LazyCapableKey, LazyResolver<LazyCapableProps[LazyCapableKey]> | undefined]> =
        Object.keys(routeProps)
            .filter((key): key is `${LazyCapableKey}Lazy` => key.endsWith('Lazy'))
            .map((lazyKey) => {
                const key = lazyKey.slice(0, -4) as LazyCapableKey; // Remove 'Lazy' suffix
                return [key, routeProps[lazyKey] as LazyResolver<LazyCapableProps[typeof key]>];
            });

    // Extract any explicit lazy prop
    const explicitLazy = routeProps.lazy;

    // Determine which lazy resolvers are active
    const activeResolvers = lazyResolvers.filter(([, resolver]) => typeof resolver === 'function');
    const hasLazyProps = activeResolvers.length > 0;

    const derivedLazy = (
        hasLazyProps
            ? async () => {
                  const resolvedEntries = await Promise.all(
                      activeResolvers.map(async ([key, resolver]) => [key, await resolver!()]),
                  );
                  return resolvedEntries.reduce<LazyResult>((acc, [key, value]) => {
                      acc[key as LazyCapableKey] = unwrapDefault(value);
                      return acc;
                  }, {}) as LazyResolvedRoute;
              }
            : explicitLazy
    ) as RouteProps['lazy'];

    if (hasLazyProps && explicitLazy && process.env.NODE_ENV !== 'production') {
        console.warn('LazyRoute: provided lazy prop ignored in favour of *Lazy props.');
    }

    const finalRouteProps = {
        ...(routeProps as RouteProps),
        lazy: derivedLazy,
    } as RouteProps;

    return <Route {...finalRouteProps} />;
};

const LazyRoute = (routeProps: LazyRouteProps): React.ReactElement => {
    return createRouteFromLazyProps(routeProps);
};

function resolveLazyChildren(children: React.ReactNode): React.ReactNode {
    if (children == null) {
        return children;
    }

    return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return resolveLazyElement(child);
        }
        return child;
    });
}

function resolveLazyElement(element: React.ReactElement): React.ReactElement {
    const props = element.props as { children?: React.ReactNode };
    const resolvedChildren = resolveLazyChildren(props.children);

    if (element.type === LazyRoute) {
        return createRouteFromLazyProps({ ...(element.props as LazyRouteProps), children: resolvedChildren });
    }

    if (resolvedChildren === props.children) {
        return element;
    }

    return React.cloneElement(element, undefined, resolvedChildren);
}

export const resolveLazyRouteTree = (node: React.ReactElement): React.ReactElement => {
    return resolveLazyElement(node);
};

export default LazyRoute;
