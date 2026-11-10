# Codex Skill Collection

Research and versioned source backups of skills evaluated for Codex.

## Pixelfx

Đã lưu nguyên kho nguồn tại [`skills/pixelfx`](skills/pixelfx), gồm thư viện hiệu
ứng, công cụ render/export, gallery và tài liệu. Hướng dẫn skill gốc nằm tại
[`skills/pixelfx/skills/pixelfx/SKILL.md`](skills/pixelfx/skills/pixelfx/SKILL.md).
Phiên bản nguồn và SHA-256 của từng file được ghi trong
[`research/pixelfx-source.json`](research/pixelfx-source.json); manifest này cũng
đưa toàn bộ kho pixelfx vào hệ thống theo dõi cập nhật hiện có.

Đây là bản lưu trong project, chưa cài vào thư mục skill cá nhân hoặc đăng ký
plugin trên tài khoản. Giữ nguyên cấu trúc upstream: các đường dẫn `tools/`,
`src/`, `docs/` trong skill được tính từ `skills/pixelfx`, không phải thư mục
chứa `SKILL.md`. Skill gốc hướng dẫn cài cho Claude Code; khả năng Codex tự nhận
diện chưa được kiểm chứng.

Thư viện yêu cầu Node.js 18+; FFmpeg tùy chọn cho preview GIF/MP4. Mã và hiệu ứng
dùng MIT, giữ nguyên LICENSE và NOTICE.md. Font Patch Pixel trong `gallery/fonts`
có bản quyền riêng, không thuộc MIT; xem NOTICE.md trong thư mục đó trước khi
tái sử dụng font. Lượt lưu này chỉ kiểm tra tính toàn vẹn bản sao, chưa đánh giá
chất lượng hiệu ứng hoặc chạy công cụ upstream.

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

## Thử nghiệm teardown với Codex

Mẫu [Desert Eagle — nghiên cứu ngoại hình](examples/desert-eagle-viewer/README.md)
có [file HTML offline](examples/desert-eagle-viewer/demo.html), camera tương tác,
hai màu bề mặt và bố cục mobile. Tải HTML về rồi mở bằng trình duyệt hỗ trợ WebGL.
[Báo cáo đánh giá](research/evaluations/2026-11-06-teardown-codex.md) phân biệt
khả năng đã kiểm chứng, chất lượng hình và những phần chưa thử.

Bản mới **[Desert Eagle — Reference Console](examples/desert-eagle-console/README.md)**
chuyển thể bố cục và cấu trúc `v8-live` của tác giả, có tour 24 giây và thông số
camera/vật liệu đồng bộ với cảnh. [Mở HTML offline](examples/desert-eagle-console/demo.html).

Bản **[Desert Eagle — V8 Reference Edition](examples/desert-eagle-v8/README.md)**
lấy trực tiếp `v8-live/v8-shared` làm chuẩn, giữ nguyên vị trí bảy panel và
hệ thống thiết kế của tác giả. [Demo offline](examples/desert-eagle-v8/demo.html) ·
[Ảnh đối chiếu V8/bản mới/bản cũ](examples/desert-eagle-v8/comparison.png).
Không dùng demo Claude làm nguồn triển khai.

## Agent Desktop

Bộ skill thao tác desktop được lưu nguyên bản từ
https://github.com/vercel-labs/agent-desktop, commit
`b43ac4f6e892ef608f8851428613c4009f0e84c7`. Bao gồm skill chính `skills/agent-desktop` cùng
`agent-desktop-windows`, `agent-desktop-macos`, `agent-desktop-linux` và toàn bộ
references của bốn thư mục đó. Giấy phép Apache-2.0 được giữ trong từng thư mục;
nguồn và SHA-256 nằm ở `research/agent-desktop-source.json` (đường dẫn checksum
tính từ `skills/`). Không bao gồm skill FFI, jev-desktop hay binary CLI.

Để dùng trên máy cá nhân, kéo các thư mục trên về và chép `agent-desktop` cùng
skill tương ứng hệ điều hành vào thư mục skill người dùng của agent
(với Codex: `~/.agents/skills/`; Windows: `%USERPROFILE%\.agents\skills\`).
Cài CLI riêng trên chính máy có desktop cần điều khiển:

```sh
npm install -g agent-desktop
agent-desktop status
agent-desktop skills get desktop
agent-desktop skills get platform
```

Trên macOS, dùng `agent-desktop permissions --guide` để xem hướng dẫn cấp quyền.
Ưu tiên hướng dẫn nhúng trong CLI nếu phiên bản CLI khác bản skill lưu trữ.
Bản này chỉ được bảo tồn và kiểm tra tính toàn vẹn; chưa thử điều khiển desktop.

## PPT Master

Lưu nguyên gói skill tự chứa tại `skills/ppt-master`, từ
https://github.com/hugohe3/ppt-master, commit `ce92fb43e4ade9c701f4c869e286f13fce743c72`
(phiên bản khai báo trong SKILL.md: 6.9.0). Bao gồm workflow, references, scripts,
tests, templates, icon, âm thanh, `.env.example`, requirements và các giấy phép/
THIRD_PARTY_NOTICES; không bao gồm repo-level docs, ảnh quảng bá hay projects.
Nguồn và SHA-256 của từng file: `research/ppt-master-source.json`
(đường dẫn checksum tính từ `skills/ppt-master`).

Session trên máy cá nhân kéo repo, chép nguyên thư mục `skills/ppt-master` vào
`~/.agents/skills/ppt-master` (Windows: `%USERPROFILE%\.agents\skills\ppt-master`),
rồi cài dependencies từ `requirements.txt` trong thư mục đã chép bằng Python
3.10–3.14, ví dụ `python -m pip install -r <duong-dan-skill>/requirements.txt`.
Đọc SKILL.md từ đường dẫn tuyệt đối của bản cài và theo hướng dẫn nhúng.
API key cho chức năng tùy chọn được cấu hình riêng trên máy, không lưu vào repo.

Đây là bản bảo tồn được kiểm tra file/checksum; chưa cài dependency hoặc thử tạo
slide. Các dependency ngoài không được đóng gói, nên cài đặt vẫn cần mạng.

## Figma MCP Bridge

Lưu đầy đủ source MCP server và plugin Figma tại `tools/figma-mcp-bridge`, từ
https://github.com/gethopp/figma-mcp-bridge, commit `0a55fa405545edb00b8cd856f842257facad685e`
(phiên bản server/plugin 0.0.26). Đây là công cụ MCP, không phải Agent Skill:
không chép vào `~/.agents/skills`. Giữ nguyên README, LICENSE.md (MIT), lockfile,
mã nguồn và cấu hình build. Nguồn và SHA-256 từng file nằm ở
`research/figma-mcp-bridge-source.json` (checksum tính từ thư mục công cụ).

### Khôi phục trên máy cá nhân

Cần Figma Desktop Windows/macOS, Node.js 20+ và Bun để build bản đã lưu.
Sau khi kéo kho, chạy từ `tools/figma-mcp-bridge`:

```sh
cd server
bun install --frozen-lockfile
bun run build
cd ../plugin
bun install --frozen-lockfile
bun run build
```

Trong Figma Desktop, chọn **Plugins → Development → Import plugin from manifest**,
trỏ tới `plugin/manifest.json` của bản đã build. Mở plugin trong từng file muốn
agent truy cập. Không cần chạy workflow release được lưu trong `.github/`.

Thêm cấu hình vào file cấu hình Codex local (đổi đường dẫn mẫu thành đường dẫn
tuyệt đối trên máy; trên Windows có thể dùng dấu `/`):

```toml
[mcp_servers.figma_bridge]
command = "node"
args = ["/absolute/path/Codex-Skill-Collection/tools/figma-mcp-bridge/server/dist/index.js"]
```

Khởi động lại Codex sau khi cấu hình. Đọc README nguồn để biết cách dùng tool,
giới hạn và cách bật `run_script` nếu cần; mặc định giữ script tắt và server
ở localhost. Giao tiếp này đi qua plugin local, không dùng đường REST API đọc
tài liệu, nhưng không thay đổi quota của plugin Figma khác trong chat.

Bản lưu chưa gồm `node_modules` hoặc binary build: cài dependency vẫn cần mạng.
Đã kiểm tra bản sao và checksum; chưa build hoặc thử kết nối với Figma Desktop.

## Hallmark và Taste Skill

Lưu nguyên các gói skill và toàn bộ scripts, references, assets/library đi kèm:

| Gói | Bản lưu | Nguồn và checksum |
| --- | --- | --- |
| `skills/hallmark` | Hallmark 2.0.0 | `research/hallmark-source.json` |
| `skills/taste-skill` | Taste Skill 2.5.1, tên skill `design-taste-frontend` | `research/taste-skill-source.json` |

SHA nguồn đầy đủ nằm trong manifest; đường dẫn SHA-256 tính từ thư mục gói.
`UPSTREAM_README.md` là README repo nguồn được chép nguyên bản; LICENSE của
Taste được chép từ gốc repo vì không có sẵn trong gói. Các file gói không bị
sửa; ghi công/giấy phép ảnh và tài nguyên bên thứ ba được giữ nguyên. Chưa chạy
installer, dependency, checker hay demo của hai skill; chỉ kiểm tra bản sao.

Session trên máy cá nhân kéo repo rồi chép nguyên từng thư mục vào
`~/.agents/skills/` (Windows: `%USERPROFILE%\.agents\skills\`). Với Taste,
có thể đặt thư mục đích là `design-taste-frontend` để trùng tên skill và các
đường dẫn dự phòng của hook. Khởi động session Codex mới để kiểm tra discovery;
nếu chưa nhận, yêu cầu agent đọc SKILL.md từ đường dẫn tuyệt đối.

Hallmark cần Node 18+; render cần Chrome/Chromium và `puppeteer-core` cài riêng.
Taste cần Node 22+ và Chrome/Edge/Chromium, ffmpeg tùy chọn. Phải dùng toàn gói,
không chỉ chép SKILL.md; tài nguyên ngoài như font/ảnh/icon có thể cần mạng.
Không mặc định bật chung hai workflow vì quy tắc bố cục/motion khác nhau.

### Chọn skill khi cải thiện UI của tool HTML

Ưu tiên **Hallmark ở app scope**, không dùng flow landing page.
`references/flow.md` mục **App screens** dành riêng dashboard, admin, settings
và tool: bỏ hero, nhịp section, word budget và ảnh stand-in; giữ shell hiện có,
ưu tiên bảng, form, mật độ control, focus, contrast và trạng thái loading/empty/
error/full. Audit trước để xác định vấn đề; polish để chỉnh nhẹ, chỉ redesign
khi cần thay cấu trúc. Đọc `references/redesign.md` trước khi áp dụng.

Prompt gợi ý: “Dùng Hallmark audit UI của tool HTML tại <đường-dẫn>, xem đây là
app screen. Sau đó polish màu, typography, spacing, control states và responsive;
giữ nguyên xử lý dữ liệu, sự kiện, ID/selector đang dùng và luồng thao tác.
Không thêm hero, section toàn màn hình hoặc animation trang trí.”

Taste phù hợp hơn khi xây website giới thiệu cho tool hoặc trang marketing có
ảnh/motion; quy tắc một section mỗi màn hình và các moment không nên ép lên
giao diện làm việc dày đặc. Kết luận này dựa trên hướng dẫn, chưa phải benchmark
cùng một tool qua hai skill.
