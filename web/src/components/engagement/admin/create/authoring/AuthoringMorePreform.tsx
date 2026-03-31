import { SystemMessage } from 'components/common/Layout/SystemMessage';
import { Language } from 'models/language';
import React, { Suspense, useEffect, useState } from 'react';
import { AuthoringMorePreformProps } from './types';
import { Await } from 'react-router';

const AuthoringMorePreform = ({ languages }: AuthoringMorePreformProps) => {
    const [languageList, setLanguageList] = useState<Language[]>();
    // TODO: Track translation completion for accurate values

    useEffect(() => {
        languages.then((langs) => {
            if (langs && Array.isArray(langs) && langs.length > 0) {
                setLanguageList(langs);
            }
        });
    }, [languages]);

    return (
        <SystemMessage sx={{ marginBottom: '1.5rem' }} status="danger">
            <p>
                <strong>If you choose to include this optional section of content</strong>
                <span>
                    {' in your engagement, all "required" content fields must be completed for all languages in order for ' +
                        'this section of your engagement page to be published.'}
                </span>
            </p>
            <ul>
                <Suspense>
                    <Await resolve={languages}>
                        {languageList?.map((lang) => (
                            <li key={lang.id}>
                                <strong>{lang.name}</strong> content is incomplete
                            </li>
                        ))}
                    </Await>
                </Suspense>
            </ul>
        </SystemMessage>
    );
};

export default AuthoringMorePreform;
