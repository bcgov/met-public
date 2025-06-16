import { Breadcrumbs } from '@mui/material';
import React, { useMemo } from 'react';
import { BodyText } from '../Typography';
import { Link } from '../Navigation';
import { UIMatch, useLocation, useMatches } from 'react-router-dom';

type BreadcrumbProps = {
    name: string;
    link?: string;
};

/**
 * A component that displays a breadcrumb trail based on the provided crumbs.
 * Each crumb can be a link or plain text, and the last crumb is always displayed as plain text.
 * @param {Object} props - The properties for the breadcrumb trail component.
 * @param {Object[]} props.crumbs - An array of objects representing the breadcrumb items, each with a name and an optional link.
 * @param {boolean} [props.smallScreenOnly] - If true, the breadcrumbs will only be displayed on small screens.
 * @returns A JSX element representing the breadcrumb trail.
 * @example
 * <BreadcrumbTrail
 *     crumbs={[
 *         { name: 'Home', link: '/' },
 *         { name: 'Products', link: '/products' },
 *         { name: 'Electronics' } // Last crumb without a link
 *     ]}
 *     smallScreenOnly={true}
 * />
 */
export const BreadcrumbTrail: React.FC<{ crumbs: BreadcrumbProps[]; smallScreenOnly?: boolean }> = ({
    crumbs,
    smallScreenOnly,
}) => {
    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            component="nav"
            sx={smallScreenOnly ? { display: { xs: 'block', md: 'none' } } : {}}
        >
            {crumbs.map((crumb, index) =>
                crumb.link ? (
                    <Link size="small" key={crumb.name} to={crumb.link}>
                        {crumb.name}
                    </Link>
                ) : (
                    <BodyText
                        size="small"
                        bold={index == crumbs.length - 1}
                        key={crumb.name}
                        sx={{ lineHeight: '24px' }}
                    >
                        {crumb.name}
                    </BodyText>
                ),
            )}
        </Breadcrumbs>
    );
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UIMatchWithCrumb
    extends UIMatch<unknown, { crumb?: (data: unknown) => Promise<{ name: string; link?: string }> }> {}

/**
 * Automatically generates breadcrumbs based on the `handle.crumb` function of the current route and its parents.
 * @param {Object} props - The properties for the AutoBreadcrumbs component.
 * @param {boolean} [props.smallScreenOnly] - If true, only displays the breadcrumbs on small screens.
 * @returns A list of breadcrumbs.
 */
export const AutoBreadcrumbs: React.FC<{ smallScreenOnly?: boolean }> = ({ smallScreenOnly }) => {
    const location = useLocation();
    const matches = (useMatches() as UIMatchWithCrumb[]).filter((match) => match.handle?.crumb);

    const crumbs = useMemo(() => {
        return matches.map((match) => {
            const data = match.data as unknown;
            const handle = match.handle as {
                crumb?: (data: unknown) => Promise<{ name: string; link?: string }>;
            };
            return handle?.crumb ? handle.crumb(data) : Promise.resolve({ name: '', link: '' });
        });
    }, [location.pathname]);

    const [resolvedCrumbs, setResolvedCrumbs] = React.useState<{ name: string; link?: string }[]>(
        new Array(matches.length).fill({ name: 'Loading...', link: '' }),
    );

    React.useEffect(() => {
        Promise.all(crumbs).then((results) => {
            setResolvedCrumbs(results);
        });
    }, [crumbs]);

    return (
        <Breadcrumbs aria-label="breadcrumbs" sx={smallScreenOnly ? { display: { xs: 'block', md: 'none' } } : {}}>
            {resolvedCrumbs.map((resolvedCrumb, index) => {
                const name = resolvedCrumb?.name;
                const link = index < matches.length - 1 ? resolvedCrumb?.link ?? matches[index].pathname : undefined;
                return link ? (
                    <Link size="small" key={matches[index].pathname + name} to={link}>
                        {name}
                    </Link>
                ) : (
                    <BodyText
                        size="small"
                        bold={index == matches.length - 1}
                        key={matches[index].pathname + name}
                        sx={{ lineHeight: '24px' }}
                    >
                        {name}
                    </BodyText>
                );
            })}
        </Breadcrumbs>
    );
};
