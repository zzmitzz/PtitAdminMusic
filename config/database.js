const mongoose = require("mongoose");

// Khai báo hàm kết nối đến cơ sở dữ liệu MongoDB bằng Mongoose và thông báo kết quả trong console:
module.exports.connect = async () => {
    try {
        // Thử thực hiện kết nối đến MongoDB sử dụng Mongoose và địa chỉ từ biến môi trường `MONGO_URL`.
        await mongoose.connect(process.env.MONGO_URL);

        // In ra thông báo kết nối thành công nếu không có lỗi nào xảy ra.
        console.log("Connect Success");
    } catch (error) {
        // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình kết nối.
        console.log("Connect Error");
    }
}
