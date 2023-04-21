import React from 'react';

import { MetHeader4, MetBody } from 'components/common';

const DayZeroRules = () => (
    <div>
        <MetHeader4 bold>Holidays</MetHeader4>
        <div>
            <ul>
                <li>
                    <MetBody>
                        If a deadline falls on a holiday the deadline is extended to the next day that is not a holiday.
                        For example, if the deadline for a comment period is December 26, boxing day, the deadline is
                        extended to December 27.
                    </MetBody>
                </li>
            </ul>
        </div>
        <MetHeader4 bold>Weekends or Other Office Closures</MetHeader4>
        <div>
            <ul>
                <li>
                    <MetBody>
                        If a deadline falls on a day when the office is not open (Saturday, Sunday) the deadline is
                        extended to the next day that the office is open. For example, if the deadline for a comment
                        period falls on a Saturday then the deadline is extended to Monday.
                    </MetBody>
                </li>
            </ul>
        </div>
        <MetHeader4 bold>Calculation of Days</MetHeader4>
        <div>
            <ul>
                <li>
                    <MetBody>
                        When calculating periods (for example 30 day comment period) the first day must be excluded and
                        the last day included. For example, a 30 day comment period starts March 1, 2017, the comment
                        period does not end until March 31, 2017.
                    </MetBody>
                </li>
                <li>
                    <MetBody>
                        Legislated time periods must be calculated with day -0- eg, Evaluation 30 days, Application
                        Review 180 days, Ministers Decision 45 days, and Public Comment Periods.
                    </MetBody>
                </li>
            </ul>
        </div>
        <MetHeader4 bold>Time of Day</MetHeader4>
        <div>
            <ul>
                <li>
                    <MetBody>
                        There is no specific mention of time of day in the Interpretation Act so the day would end at
                        midnight. If a comment is received before midnight on the last day of the comment period it
                        would be included in the comment period. If an email was received at 11:59PM it would be
                        received in the comment period or if a written comment was received at an open house before
                        midnight then the comment would also be included in the comment period. Comments sent by mail or
                        courier must be post marked by the last day of the comment period in order to be included in the
                        comment period.
                    </MetBody>
                </li>
            </ul>
        </div>
        <MetHeader4 bold>Suspension</MetHeader4>
        <div>
            <ul>
                <li>
                    <MetBody>
                        Suspending a project during the Application Review period, when the suspension resumes it starts
                        back on the day it was suspended on. If a project is suspended on day 50 of the 180, in
                        accordance with the spirit of the Act, day 49 was the last full day of the Application Review
                        Period, when the project resumes, it would resume on day 50 to allow 180 full days of review.
                    </MetBody>
                </li>
            </ul>
        </div>
        <MetHeader4 bold>Interpretation Act</MetHeader4>
        <div>
            <ul>
                <p>
                    25 (1) This section applies to an enactment and to a deed, conveyance or other legal instrument
                    unless specifically provided otherwise in the deed, conveyance or other legal instrument.
                </p>
                <p>
                    (2) If the time for doing an act falls or expires on a holiday, the time is extended to the next day
                    that is not a holiday.
                </p>
                <p>
                    (3) If the time for doing an act in a business office falls or expires on a day when the office is
                    not open during regular business hours, the time is extended to the next day that the office is
                    open.
                </p>
                <p>
                    (4) In the calculation of time expressed as clear days, weeks, months or years, or as "at least" or
                    "not less than" a number of days, weeks, months or years, the first and last days must be excluded.
                </p>
                <p>
                    (5) In the calculation of time not referred to in subsection (4), the first day must be excluded and
                    the last day included.
                </p>
                <p>
                    (6) If, under this section, the calculation of time ends on a day in a month that has no date
                    corresponding to the first day of the period of time, the time ends on the last day of that month.
                </p>
                <p>
                    (7) A specified time of day is a reference to Pacific Standard time, or 8 hours behind Greenwich
                    mean time, unless Daylight Saving time is being used or observed on that day.
                </p>
                <p>
                    (8) A person reaches a particular age expressed in years at the start of the relevant anniversary of
                    his or her date of birth."
                </p>
            </ul>
        </div>
    </div>
);

export default DayZeroRules;
