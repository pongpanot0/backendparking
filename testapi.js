const http = require("http"); // เรียกใช้ http module

const hostname = "192.168.4.243"; // กำหนด hostname หรือ ip
const port = 7307; // กำหนด port
const moment = require("moment");
// สร้าง server object ที่สามารถปล่อย event ต่างๆ ขึ้นกับ ข้อมูลและรูปแบบที่ request
const server = http.createServer((request, response) => {
    // `request`คือ http.IncomingMessage, ที่เป็นแบบ Readable Stream
    // `response` คือ http.ServerResponse, ที่เป็นแบบ Writable Stream

    const { headers, method, url } = request; // ดึง property บางตัวมาไว้ใช้งาน
    let body = [];
    // เมื่อเป็น request ที่ใช้งาน ReadableStream
    request
        .on("error", (err) => {
            // กรณี error
            console.error(err);
        })
        .on("data", (chunk) => {
            // มีข้อมูลส่งเข้ามา ส่งข้อมูลเข้าไปใน callback function

            body.push(chunk); // เก็บข้อมูลเพิ่มเข้าไปใน array ที่ชื่อ body
        })
        .on("end", () => {
            // เมื่อส่งข้อมูลครบแล้ว ไม่มีข้อมูลเพิ่มเติม
            body = Buffer.concat(body).toString();
            // แปลงข้อมูลรวมเป็น string

            // ตรวจสอบว่ามี error เกิดขึ้นใน response object หรือไม่
            response.on("error", (err) => {
                console.error(err);
            });

            // กำหนด heasers ให้กับ response headers แบบ "implicit"
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");

            // หรือจะกำหนดแบบ "explicit" ด้วยรูปแบบโค้ดด้านล่างนี้ก็ได้
            // response.writeHead(200, {'Content-Type': 'application/json'})
            // จำไว้เสมอว่า ส่วนของการกำหนด headers ต้องมาก่อนส่วสนของการกำหนด response body

            //  สร้างตัวแปร เก็บข้อมูล ที่จะส่งออกไปใน response body
            const responseBody = { headers, method, url, body };
          
            if (responseBody.url == "/api/SetIdentify") {
                const res = JSON.parse(body)

                const personId = res["personId"];
                const deviceKey = res["deviceKey"];
                const name = res["name"];
                const time = res["time"];

                if (res["personId"] !== "STRANGERBABY") {
                    const lineNotify = require("line-notify-nodejs")(
                        "NjH4knloqIwedFYOgHnpl6CKZbYtMsUBPxSDeOQHVRg"
                    );
                    lineNotify
                        .notify({
                            message: `
คุณ : ${name} (รหัส:${personId})
บันทึกเวลา : @${deviceKey}
วันที่ : ${moment(time, "x").format("DD/MM/YYYY")}
เวลา : ${moment(time, "x").format("HH:mm")}`,
                        })
                        .then((res) => { console.log(res)})
                        .catch((err) => { return })
                }
            }
            const success = { result: 1, success: true };
            const data = JSON.stringify(success);
            // เขียนข้อมูลเพื่อส่งออกไปยัง client
            // ฟังก์ชั่น JSON.stringify() เป็นคำส่ังสำหรับแปลง javascript object ให้อยู่ในรูปแบบ json string
            response.write(data);

            response.end(data);
            // หรือจะเขียนแบบย่อ ส่งข้อมูลไปใน end() ก็ได้ ตามรูปแบบด้านล่าง
            // response.end(JSON.stringify(responseBody))
        });
});

// server ตรวจจับ request event
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
