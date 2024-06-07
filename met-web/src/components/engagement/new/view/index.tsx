import { BodyText, Header1 } from 'components/common/Typography';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'components/common/Input';

export const ViewEngagement = () => {
    const { slug, language } = useParams();
    const oldLink = `/${slug}/${language}`;
    return (
        <>
            <header>
                <Header1>View Engagement "{slug}"</Header1>
            </header>
            <main>
                <BodyText>The new engagement view will be displayed here once work is completed. </BodyText>
                <BodyText>
                    For now, please use the <Link to={oldLink}>old view</Link>.
                </BodyText>
                <BodyText>Work to be completed: </BodyText>
                <ul>
                    <li>
                        <Link to="https://apps.itsm.gov.bc.ca/jira/browse/DESENG-636">
                            <s>Create new engagement view page</s>
                        </Link>
                    </li>
                    <li>
                        <Link to="https://apps.itsm.gov.bc.ca/jira/browse/DESENG-630">
                            Add new header section to the new engagement view
                        </Link>
                    </li>
                    <li>
                        <Link to="https://apps.itsm.gov.bc.ca/jira/browse/DESENG-631">
                            Add new Engagement description section
                        </Link>
                    </li>
                    <li>
                        <Link to="https://apps.itsm.gov.bc.ca/jira/browse/DESENG-632">
                            Add new Dynamic pages section
                        </Link>
                    </li>
                    <li>
                        <Link to="https://apps.itsm.gov.bc.ca/jira/browse/DESENG-633">
                            Add new Survey block section
                        </Link>
                    </li>
                </ul>
            </main>
        </>
    );
};

export default ViewEngagement;
