import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceAllInURL } from 'helper';

interface SubmitCACForm {
    engagement_id: number;
    widget_id: number;
    form_data: {
        understand: boolean;
        terms_of_reference: boolean;
        first_name: string;
        last_name: string;
        city: string;
        email: string;
    };
}
export const submitCACForm = async ({ engagement_id, widget_id, form_data }: SubmitCACForm): Promise<void> => {
    const url = replaceAllInURL({
        URL: Endpoints.CACForm.CREATE,
        params: {
            engagement_id: String(engagement_id),
            widget_id: String(widget_id),
        },
    });
    // await http.PostRequest<SubmitCACForm>(url, form_data);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return Promise.resolve();
};
