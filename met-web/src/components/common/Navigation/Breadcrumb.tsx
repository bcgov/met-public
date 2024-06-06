import { Breadcrumbs } from '@mui/material';
import React, { Suspense } from 'react';
import { BodyText } from '../Typography';
import { Link } from '../Navigation';
import { Await, UIMatch, useMatches } from 'react-router-dom';

type BreadcrumbProps = {
    name: string;
    link?: string;
};

export const BreadcrumbTrail: React.FC<{ crumbs: BreadcrumbProps[]; smallScreenOnly?: boolean }> = ({
    crumbs,
    smallScreenOnly,
}) => {
    return (
        <Breadcrumbs aria-label="breadcrumb" sx={smallScreenOnly ? { display: { xs: 'block', md: 'none' } } : {}}>
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
    const matches = (useMatches() as UIMatchWithCrumb[]).filter((match) => match.handle?.crumb);
    return (
        <Breadcrumbs aria-label="breadcrumb" sx={smallScreenOnly ? { display: { xs: 'block', md: 'none' } } : {}}>
            {matches.map((match, index) => {
                const data = match.data as unknown;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const handle = match.handle as {
                    crumb?: (data: unknown) => Promise<{ name: string; link?: string }>;
                };
                if (!handle?.crumb) return null;
                const crumb = handle.crumb?.(data);
                return (
                    <Suspense
                        key={match.pathname}
                        fallback={
                            <BodyText bold size="small">
                                Loading...
                            </BodyText>
                        }
                    >
                        <Await resolve={crumb} errorElement={null}>
                            {(resolvedCrumb) => {
                                const name = resolvedCrumb?.name;
                                const link =
                                    index < matches.length - 1 ? resolvedCrumb?.link ?? match.pathname : undefined;
                                return link ? (
                                    <Link size="small" key={name} to={link}>
                                        {name}
                                    </Link>
                                ) : (
                                    <BodyText
                                        size="small"
                                        bold={index == matches.length - 1}
                                        key={name}
                                        sx={{ lineHeight: '24px' }}
                                    >
                                        {name}
                                    </BodyText>
                                );
                            }}
                        </Await>
                    </Suspense>
                );
            })}
        </Breadcrumbs>
    );
};
