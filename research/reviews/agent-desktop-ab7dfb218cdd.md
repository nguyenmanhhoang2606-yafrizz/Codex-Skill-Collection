# Đánh giá cập nhật agent-desktop

Base: `b43ac4f6e892ef608f8851428613c4009f0e84c7`

Head: `ab7dfb218cddc1594aa1d87a5bfcd0ac76da2276`

Quyết định: **defer**. Chỉ đánh giá tĩnh, chưa cài cập nhật.

Đã đọc toàn bộ diff trong phạm vi `skills/`: chỉ `skills/agent-desktop/references/commands-system.md` đổi một đoạn cảnh báo CDP. Bản mới làm rõ **mọi process local, kể cả tài khoản khác**, có thể điều khiển web contents vì DevTools port không có authentication; bản cũ chỉ nói process cùng user. Không thay đổi workflow, dependency, license hay asset trong phạm vi backup. Lợi ích cho Codex là mô tả đúng ranh giới quyền; không thêm quyền hoặc xung đột chỉ dẫn. Hai commit upstream còn có lời tác giả về sửa state transition của CLI, nhưng binary/mã CLI không nằm trong backup skill và hành vi đó chưa được xác minh. Không đề nghị lấy từng phần vì chưa đối chiếu compatibility với CLI local của người dùng. **Defer**: giữ nguyên bản lưu trong tác vụ thêm bridge này, xem xét đồng bộ khi có yêu cầu cập nhật. Không chạy CLI/test candidate hoặc mở CDP; không có đo latency/token, thay đổi prompt chỉ một đoạn. Tin cậy cao cho diff tài liệu, chưa kết luận về CLI runtime.

Bằng chứng: https://github.com/vercel-labs/agent-desktop/compare/b43ac4f6e892ef608f8851428613c4009f0e84c7...ab7dfb218cddc1594aa1d87a5bfcd0ac76da2276; dữ liệu GitHub compare do checker tải về, đã đọc patch của mọi file trong phạm vi backup. Không thay commit/checksum nguồn đang lưu.
