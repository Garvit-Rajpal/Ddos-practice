"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_turnstile_1 = require("@marsidev/react-turnstile");
require("./App.css");
const axios_1 = __importDefault(require("axios"));
const react_1 = require("react");
function App() {
    const [token, setToken] = (0, react_1.useState)("");
    return (<>
      <input placeholder='OTP'></input>
      <input placeholder='New password'></input>

      <react_turnstile_1.Turnstile onSuccess={(token) => {
            setToken(token);
        }} siteKey='0x4AAAAAABFjhjhnTJi10dHV'/>

      <button onClick={() => {
            axios_1.default.post("http://localhost:3000/reset-password", {
                email: "harkirat@gmail.com",
                otp: "123456",
                token: token,
            });
        }}>Update password</button>
    </>);
}
exports.default = App;
