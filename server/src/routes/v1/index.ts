import { Hono } from "hono";
import AuthRoute from "../../modules/auth/auth.route.js";
import UserRoute from "../../modules/user/user.route.js";
import TaskRoute from "../../modules/task/task.route.js";

const apiV1 = new Hono();

// Routes
apiV1.route("/auth", AuthRoute);
apiV1.route("/user", UserRoute);
apiV1.route("/task", TaskRoute);


export default apiV1;