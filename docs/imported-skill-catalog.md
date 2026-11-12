# Danh mục nguồn đã lưu: Composio và bài post 20 mục

Lưu theo yêu cầu người dùng, không tự cài hoặc kích hoạt bất kỳ plugin/hook/MCP nào.
Nguồn danh sách: https://x.com/Y0urDumble/status/2119793194435027220.
Giữ nguyên Hallmark và pixelfx đã lưu; thêm 19 snapshot mới (18 mục còn thiếu
trong bài post cộng Composio). Mỗi snapshot chứa toàn bộ file được upstream
theo dõi tại commit đã ghi, gồm code, skills, lockfile nếu có, giấy phép,
notice, test, fixture và demo. Không tải lịch sử Git hoặc dependency bên ngoài.

## Các nguồn mới

| Nguồn | Đường dẫn bản lưu | Commit | Ghi chú |
| --- | --- | --- | --- |
| [anatomy](https://github.com/wheresryan22/anatomy) | `skills/anatomy` | `1482e8469b0a` (main) | Skill SVG/isometric/WebGL; giữ kit và examples, không cần Blender cho đường SVG. |
| [anthropic-skills](https://github.com/anthropics/skills) | `skills/anthropic-skills` | `2c5958ecac7c` (main) | Kho nhiều skill; giấy phép theo từng thư mục, không có license gốc chung. |
| [anything2explainer](https://github.com/Vincentwei1021/anything2explainer) | `skills/anything2explainer` | `0b85f6c7bfc4` (main) | PolyForm Noncommercial 1.0.0; dùng thương mại cần tác giả cho phép. Font có license riêng. |
| [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | `skills/awesome-claude-skills` | `be2a406907db` (master) | Kho tổng hợp và nhiều skill Composio; chọn từng thư mục SKILL.md, app automation cần MCP/auth riêng. |
| [awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) | `skills/awesome-gamedev-agent-skills` | `c6ca6c41c839` (main) | Router và skill game đa engine; chỉ cài nhóm phù hợp engine/dự án. |
| [blender-skills](https://github.com/arjun988/blender-skills) | `skills/blender-skills` | `904f095d8f36` (main) | Các skill trong .claude/skills; cần Blender MCP khi thực thi trong Blender. |
| [gsap-skills](https://github.com/greensock/gsap-skills) | `skills/gsap-skills` | `aed9cfd32777` (main) | Bộ skill chính chủ GSAP; license của runtime GSAP áp dụng riêng. |
| [herk-edit-kit](https://github.com/nateherkai/herk-edit-kit) | `skills/herk-edit-kit` | `10511e5af86f` (main) | Bộ dựng footage dựa HyperFrames; MIT có ngoại lệ brand AIS và các quyền pipeline/third-party, không tái dùng thương hiệu mẫu như của mình. |
| [hyperframes](https://github.com/heygen-com/hyperframes) | `tools/hyperframes` | `940963afaa5f` (main) | Engine HTML → video cùng skill; cần runtime/dependency, không chỉ chép SKILL.md. |
| [impeccable](https://github.com/pbakaus/impeccable) | `tools/impeccable` | `b4bff1626c34` (main) | Audit/polish UI và engine CLI; live Apply có đường fallback tắt sandbox/approvals. Đọc README trước bật; IMPECCABLE_LIVE_COPY_AGENT=chat hoặc off để tránh fallback đó. |
| [mcp-for-blender](https://github.com/ahujasid/mcp-for-blender) | `tools/mcp-for-blender` | `2e4b0bc29469` (main) | MCP server + addon Blender; cần Blender chạy trên máy, chưa kết nối. |
| [oil-motion](https://github.com/oil-oil/oil-motion) | `skills/oil-motion` | `07e31f2265f8` (main) | Xử lý video/sequence cho tương tác web; tạo media mặc định cần provider/key; xem hỗ trợ credential store theo OS. |
| [open-design](https://github.com/nexu-io/open-design) | `tools/open-design` | `a37dc822b5ed` (main) | Ứng dụng/workspace thiết kế, MCP và template; không phải một skill đơn lẻ. |
| [openmontage](https://github.com/OpenMontageInc/OpenMontage) | `tools/openmontage` | `fecb9a1e3cc2` (main) | Workspace sản xuất video, có provider và renderer riêng; lưu đủ nguồn, chưa setup. |
| [remotion-skills](https://github.com/remotion-dev/skills) | `skills/remotion-skills` | `7e541aa4d736` (main) | Hướng dẫn chính chủ Remotion; không tự cấp license cho Remotion runtime. |
| [sprite-gen](https://github.com/aldegad/sprite-gen) | `tools/sprite-gen` | `35a27e137bfd` (main) | Skill + Python CLI sprite/loop; có phần trùng Sprite Forge, cần route media và công cụ video riêng. |
| [unity-mcp](https://github.com/CoplayDev/unity-mcp) | `tools/unity-mcp` | `e2fd09c71644` (beta) | MCP server + package Unity Editor; bản lưu theo default branch beta, không khẳng định stable release. |
| [universal-modder](https://github.com/rehan-remade/universal-modder) | `tools/universal-modder` | `3c4ac6c38e41` (main) | CLI, skills và knowledge base mod game; cần game/editor/tool riêng; provider asset có chi phí. |
| [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | `skills/video-shotcraft` | `6700db2ba805` (main) | Skill promo từ screenshot, dựa trên Remotion; xem license runtime và audio. |

## Hai nguồn đã có, không nâng phiên bản trong tác vụ này

- Hallmark: `skills/hallmark`, nguồn/checksum `research/hallmark-source.json`.
- pixelfx: `skills/pixelfx`, nguồn/checksum `research/pixelfx-source.json`.

## Session local lấy và cài thế nào

1. Chạy `git pull origin main` ở máy cá nhân. Đây là bản lưu nguồn, không tự
   trở thành plugin đã cài chỉ vì có trong checkout.
2. Chọn đúng nguồn từ bảng, đọc README và license bên trong. Các thư mục có
   nhiều skill cần cài các thư mục con chứa SKILL.md theo cấu trúc của upstream;
   các script gọi qua đường dẫn tương đối phải được giữ cạnh nhau. Repo Composio
   còn dẫn link tới nguồn ngoài; các link đó không đồng nghĩa nội dung nguồn
   ngoài đã được tải về ngoài danh sách snapshot này.
3. Với tool có engine/MCP/native binary, làm theo quy trình build/install riêng.
   Cài hết các thư mục vào đường dẫn skill không thay thế runtime, auth hoặc app.
   Bản lưu không chứa node_modules/venv được cài trong tác vụ này; dependency vẫn
   cần tải khi setup. Không chạy installer của nguồn khi chỉ muốn đọc skill.
4. Giữ nguyên giấy phép/notices: không áp một license chung cho collection.
   Anything2Explainer có giới hạn phi thương mại; Herk có ngoại lệ tài nguyên
   thương hiệu; Composio/Anthropic/Remotion không có một root LICENSE xác định
   trong các snapshot này. Kiểm tra license cụ thể trước khi dùng/phân phối lại.
5. Không commit API key hoặc dữ liệu cá nhân. API/cloud/stock/runtime có thể có
   chi phí và điều khoản riêng, không suy ra miễn phí từ việc có mã nguồn.

## Kiểm chứng và phạm vi chưa thử

Đối chiếu inventory với GitHub recursive tree của từng commit; kiểm tra Git
blob SHA-1 của mọi file, rồi tạo SHA-256 trong `research/<name>-source.json`.
Một số file .cmd được archive xuất với CRLF theo .gitattributes; bản lưu được
khôi phục về byte canonical Git (LF) và xác minh hash khớp blob upstream.
Symlink được giữ nguyên, checksum tính trên chuỗi link target; không nhân bản
file đích. Các metadata nguồn ở ngoài snapshot để không sửa code upstream.

Đây là kiểm tra bảo tồn nguồn, không phải kết luận tests/build/runtime pass.
Chưa chạy installer, native engine, benchmark, gọi API tạo media hoặc kết nối
Blender/Unity/MCP. Các AGENTS.md, hooks và workflow upstream là dữ liệu lưu trữ,
không được áp dụng cho tác vụ bảo tồn này.

### Git LFS

Có 199 file pointer Git LFS trong snapshot HyperFrames. Giữ đúng pointer theo
Git upstream và ghi oid/size trong manifest; payload LFS bên ngoài không nằm
trong archive nguồn và chưa tải. Nếu cần fixture/media/model tương ứng, lấy từ
repo upstream đúng commit rồi hydrate bằng Git LFS; không giả định
`git lfs pull` ở kho collection sẽ lấy object của remote upstream. Các dependency
và binary do installer tải cũng không phải nội dung đã đóng gói ở đây.

Để các Git LFS filter của upstream không kích hoạt khi người dùng clone/pull
collection (remote này không chứa payload LFS upstream), riêng file gốc
`tools/hyperframes/.gitattributes` được giữ nguyên byte dưới tên
`UPSTREAM.gitattributes`. Manifest ghi rõ `upstream_path_map`; đây là thay đổi
vị trí duy nhất, không chỉnh nội dung upstream. Khi khôi phục thành repo riêng
và đã cấu hình remote/payload LFS đúng, đổi tên file trở lại `.gitattributes`.
Không thực hiện đổi tên này ngay trong collection.

Bản lưu mới gồm 40.843 file, khoảng 1,55 GB dữ liệu nguồn chưa nén, bao gồm
demo/video của các repo. Payload Git LFS HyperFrames khoảng 611 MB là dữ liệu
ngoài chưa tải, không tính trong dung lượng nguồn này.
