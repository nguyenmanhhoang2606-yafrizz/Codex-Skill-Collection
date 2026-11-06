# Codex Skill Collection

Research and versioned source backups of skills evaluated for Codex.

## Teardown

The complete source backup is in `skills/teardown`, from commit
`a91262ac1109051e014662d42ecb0b7bc1f113b1` of
https://github.com/elvarofficial/teardown.
Original MIT license, credits and audio provenance are retained. File checksums
are recorded in `research/teardown-source.json`.

Restore on Linux/macOS with Node.js 20+, npm, Python 3 and Bash:

```sh
bash scripts/setup-teardown.sh
node "$HOME/.agents/skills/teardown/sims/build.mjs" v8-live
```

The setup verifies the backup, installs the user skill and locked npm dependencies,
and downloads Chromium. FFmpeg is additionally required for video/audio workflows.
Existing modified installations are preserved: setup stops if source files differ.
No download from the author's Git repository is needed. Fresh dependency/browser
installation still requires npm and Playwright download services.

This is an environment-local installation, not an account plugin. Restart the
Codex session to check discovery; automatic skill discovery has not been confirmed
in the cloud skill catalog. The agent can read the installed SKILL.md explicitly.
Build output is placed in `teardown-out` under the current working directory.

Cloud tasks are already isolated; use the existing checkout without creating a
Git worktree unless explicitly requested. Publish the prepared environment through
the product to snapshot installed files; live processes do not survive snapshots.

## Tự động theo dõi cập nhật

Workflow **Skill update monitor** chạy vào thứ Hai lúc **09:00 giờ Việt Nam**
(`0 2 * * 1` UTC), kể cả khi bạn không mở Codex. GitHub có thể chạy trễ; với repo
public không có hoạt động trong 60 ngày, GitHub có thể tắt lịch — cần bật lại trong
Actions. Có thể chạy ngay bằng **Actions → Skill update monitor → Run workflow**.

Mỗi lần kiểm tra có báo cáo tiếng Việt trong Summary và artifact
`skill-update-report` (Markdown + JSON, lưu 90 ngày). Khi có cập nhật hoặc lỗi
nguồn, bot tạo một Issue tổng hợp. Khi bằng chứng thay đổi, bot cập nhật Issue và
đăng một comment thông báo; chạy lại với cùng kết quả không gửi lại. Khi mọi skill
đã theo kịp nguồn, Issue được đóng. Bật **Watch → Custom → Issues** hoặc Subscribe
Issue để nhận thông báo theo cài đặt GitHub của bạn. Script không gửi email trực tiếp.

Không cần API AI trả phí hay secret riêng: workflow dùng GITHUB_TOKEN tạm thời do
GitHub cấp, quyền đọc nội dung và ghi Issue. GitHub Actions chịu hạn mức/chi phí của
gói GitHub; repository/organization phải cho phép Actions và Issues. Workflow phải
nằm trên nhánh mặc định (`main`) để lịch và nút Run workflow hoạt động.

Báo cáo tự động liệt kê commit/file thay đổi và gợi ý điểm cần kiểm tra, **không
khẳng định tính năng tốt hơn**. Khi bạn bắt đầu một tác vụ Codex trong repo,
`AGENTS.md` hướng dẫn agent kiểm tra bản mới và đọc diff để đánh giá. Chỉ mở giao
diện project không khởi chạy agent. Kết quả đánh giá đã lưu theo cặp commit sẽ
không bị nhắc lại; skill không tự nâng phiên bản.

Kiểm tra thủ công ở local/cloud (không đăng Issue):

```sh
python3 scripts/check_skill_updates.py --output /tmp/codex-skill-updates
python3 -m unittest discover -s tests -v
```

### Thêm skill vào danh sách theo dõi

Thêm `research/<ten-skill>-source.json` chứa tối thiểu:

```json
{
  "source": "https://github.com/owner/repository",
  "commit": "FULL_40_CHARACTER_INSTALLED_COMMIT_SHA"
}
```

Dùng SHA thật, không dùng tag/branch ở trường `commit`. Có thể thêm
`tracking_ref` (branch muốn theo dõi; mặc định default branch của nguồn) và
`upstream_path` (ví dụ `skills/example` nếu chỉ lấy một thư mục trong monorepo).
Các trường checksum/license hiện có được giữ nguyên. Tên skill lấy từ tên file.
Nguồn private cần quyền truy cập riêng; checker báo lỗi thay vì báo "đã mới nhất".

### Lưu đánh giá và cập nhật có chọn lọc

Codex ghi đánh giá vào `research/reviews/` và đánh dấu trong
`research/update-reviews.json`, ví dụ cấu trúc sau (thay bằng SHA và đường dẫn thật):

```json
{
  "teardown": {
    "base": "FULL_INSTALLED_SHA",
    "head": "FULL_REVIEWED_UPSTREAM_SHA",
    "decision": "defer",
    "report": "research/reviews/teardown-HEAD12.md"
  }
}
```

Chỉ ghi nhận sau khi đã đánh giá; checker không tự tạo đánh giá. Các lựa chọn:
`update-all`, `update-parts`, `defer`, `reject`. Với cập nhật một phần, phải ghi rõ
các commit/hunk đã lấy và phụ thuộc liên quan; không đổi commit nền thành HEAD mới
nếu bản đang dùng chưa chứa toàn bộ phiên bản đó. Cập nhật cài đặt vẫn cần yêu cầu
của người dùng. Mã nguồn backup và giấy phép không bị workflow thay đổi.
