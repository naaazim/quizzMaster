import Navbar from "./Navbar";
import { CookieService } from "../utils/cookieUtils";

function DB() {
    const user = CookieService.getUser();
    console.log(user.id);

    return (<>
        <Navbar title="Tableau de bord" />

    </>);
}

export default DB;