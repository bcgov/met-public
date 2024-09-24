import { Breadcrumbs } from '@mui/material';
import React, { useMemo } from 'react';
import { BodyText } from '../Typography';
import { Link } from '../Navigation';
import { UIMatch, useLocation, useMatches } from 'react-router-dom';

type BreadcrumbProps = {
    name: string;
    link?: string;
};

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
 * @param smallScreenOnly If true, only displays the breadcrumbs on small screens.
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
