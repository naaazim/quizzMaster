import Navbar from "./Navbar";

function DB() {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user.id);

    return (<>
        <Navbar title="Tableau de bord" />

    </>);
}

export default DB;