import {isEmail} from "validator";

export default email => {
    return `${email} ${isEmail(email) ? "is" : "isn't"} a email`;
}