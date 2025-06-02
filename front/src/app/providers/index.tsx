import { withAuth } from "./withAuth";
import { withRouter } from "./withRouter";

export const withProviders = (children: React.ReactNode) =>
    withRouter(withAuth(children));
