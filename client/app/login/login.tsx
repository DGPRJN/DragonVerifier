import axios from "axios";

export const login = () => {
    console.log("Login Button Clicked");

    const rootApi = `${process.env.NEXT_PUBLIC_BACKEND_LOCAL}/api/v1`;

    try {
        axios.get(`${rootApi}/oauth/login`).then((res) => {
            window.location = res.data.redirect;
        });
    } catch (err) {
        return false;
    }

    return true;
};
export default login;
