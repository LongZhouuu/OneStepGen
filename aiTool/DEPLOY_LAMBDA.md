# Deploy `aiTool` to AWS Lambda (manual workflow)

This guide walks through:

1. Pulling the latest code on your **local PC**
2. Uploading the project to **AWS Cloud Shell**
3. Installing **Python 3.12** in Cloud Shell
4. Building **`lambda-deploy.zip`** in Cloud Shell
5. **Downloading** the zip to your PC (Cloud Shell **Download file**)
6. **Uploading** the zip to Lambda in the AWS Console

**Lambda settings (set once in AWS Console):**

| Setting | Value |
|---------|--------|
| Runtime | Python 3.12 |
| Handler | `lambda_handler.handler` |
| Region | `ap-southeast-2` (Sydney) |
| Timeout | ≥ 30 seconds |
| Memory | 512 MB or more |

**Environment variables on the Lambda function:**

| Key | Required |
|-----|----------|
| `GROQ_API_KEY_1` | Yes (Groq API key) |
| `SITE_ACCESS_PASSWORD` | Only if you use the site password gate |
| `SITE_GATE_SESSION_SECRET` | Only if you use the site gate (long random string) |

---

## Part A — Local machine (get latest code & prepare upload)

### A1. Pull latest from GitHub

Open PowerShell or Git Bash on your PC:

```powershell
cd "C:\Users\Arya Sreevalsan\OneDrive\Documents\Desktop\happy-sun\front-end\OneStepGen"
git pull origin main
```

*(Use your branch name instead of `main` if different, e.g. `git pull origin master`.)*

### A2. Create a zip of `aiTool` to upload to Cloud Shell

You only need the **`aiTool`** folder (not the whole Vue frontend).

**PowerShell (Windows):**

```powershell
cd "C:\Users\Arya Sreevalsan\OneDrive\Documents\Desktop\happy-sun\front-end\OneStepGen"
Compress-Archive -Path "aiTool\*" -DestinationPath "aiTool-upload.zip" -Force
```

This creates:

```text
OneStepGen\aiTool-upload.zip
```

**What must be inside the zip** (after unzip in Cloud Shell):

```text
aiTool/
├── main.py
├── lambda_handler.py
├── requirements.txt
└── utils/
    ├── __init__.py
    ├── ai_processor.py
    ├── pdf_parser.py
    └── scoring.py
```

Do **not** include `venv/`, `package/`, `lambda-deploy.zip`, or `.env` (secrets belong in Lambda env vars only).

---

## Part B — AWS Cloud Shell (upload, Python 3.12, build zip)

### B1. Open Cloud Shell in the correct region

1. Sign in to [AWS Console](https://console.aws.amazon.com/).
2. Top-right region → **Asia Pacific (Sydney) `ap-southeast-2`**.
3. Click **Cloud Shell** (terminal icon in the top bar).
4. Wait until the prompt is ready (`~$`).

Verify AWS access:

```bash
aws sts get-caller-identity
```

### B2. Upload `aiTool-upload.zip` from your PC

1. In Cloud Shell, click **Actions** (top right of the terminal panel).
2. Choose **Upload file**.
3. Select `aiTool-upload.zip` from your PC  
   (`...\OneStepGen\aiTool-upload.zip`).
4. Wait until the upload finishes.

The file lands in your Cloud Shell home directory, usually:

```text
~/aiTool-upload.zip
```

### B3. Unzip and enter `aiTool`

```bash
cd ~
unzip -o aiTool-upload.zip -d aiTool-build
cd aiTool-build
```

If the zip contained a nested `aiTool` folder:

```bash
cd aiTool
```

If files are directly in `aiTool-build` (`main.py` is here), stay in `aiTool-build`:

```bash
ls
# You should see: main.py  lambda_handler.py  requirements.txt  utils/
```

The rest of this guide assumes your working directory contains `main.py` and `requirements.txt`. Adjust `cd` if needed.

### B4. Install Python 3.12

```bash
sudo dnf install -y python3.12 python3.12-pip
python3.12 --version
python3.12 -m pip --version
```

Expected: `Python 3.12.x`.

If `dnf` says package not found, run:

```bash
sudo dnf update -y
sudo dnf install -y python3.12 python3.12-pip
```

### B5. Build the Lambda deployment zip

Run these commands from the folder that contains `main.py` and `requirements.txt`:

```bash
rm -rf package lambda-deploy.zip
mkdir -p package

python3.12 -m pip install -r requirements.txt -t package --upgrade

cp main.py lambda_handler.py package/
cp -r utils package/

cd package
zip -r ../lambda-deploy.zip .
cd ..

ls -lh lambda-deploy.zip
```

You should see `lambda-deploy.zip` (often ~30–80 MB depending on dependencies).

**What the zip contains:**

- Your app: `main.py`, `lambda_handler.py`, `utils/`
- Dependencies: FastAPI, Groq, Mangum, PyPDF, etc. (from `pip install -t package`)

**Lambda handler entry point** (already in your repo):

```python
# lambda_handler.py → Mangum wraps FastAPI app
handler = Mangum(app, lifespan="off")
```

Console handler string: **`lambda_handler.handler`**

---

## Part C — Download `lambda-deploy.zip` to your PC

### C1. Note the full path in Cloud Shell

Still in the `aiTool` folder (where you ran the build):

```bash
pwd
ls -la lambda-deploy.zip
```

Example output:

```text
/home/cloudshell-user/aiTool-build/lambda-deploy.zip
```

Copy that path — you need it for **Download file**.

### C2. Download via Cloud Shell UI

1. In Cloud Shell, click **Actions**.
2. Choose **Download file**.
3. In **File path**, paste the full path from `pwd` + `/lambda-deploy.zip`, for example:

   ```text
   /home/cloudshell-user/aiTool-build/lambda-deploy.zip
   ```

   *(Use your actual path from `pwd` — do not guess.)*

4. Click **Download**.
5. Save `lambda-deploy.zip` on your PC (e.g. Downloads folder).

You now have the same zip Cloud Shell built, ready for Lambda.

---

## Part D — Upload zip to Lambda (AWS Console)

### D1. Open your Lambda function

1. AWS Console → **Lambda** → **Functions**.
2. Region: **ap-southeast-2**.
3. Open your AI/API function (the one connected to API Gateway).

Confirm:

- **Runtime:** Python 3.12  
- **Handler:** `lambda_handler.handler`

### D2. Upload the zip

1. On the function page, **Code** tab.
2. **Upload from** → **.zip file**.
3. Choose `lambda-deploy.zip` from your PC.
4. Click **Save**.

Wait until the status shows the upload succeeded (spinner finishes).

### D3. Test the API

In Cloud Shell or a local terminal:

```bash
curl -s "https://0xkm79ikl9.execute-api.ap-southeast-2.amazonaws.com/"
```

Expected JSON:

```json
{
  "message": "ADHD Productivity Tool API is running!",
  "docs": "Visit /docs for the interactive API explorer."
}
```

If AI calls fail, check **Lambda → Configuration → Environment variables** → `GROQ_API_KEY_1` is set.

---

## Part E — Repeat deploy after code changes

| Step | Where | Action |
|------|--------|--------|
| 1 | Local PC | `git pull` |
| 2 | Local PC | Recreate `aiTool-upload.zip` (Part A2) |
| 3 | Cloud Shell | Upload new zip (Part B2) |
| 4 | Cloud Shell | Unzip, build (Part B3–B5) |
| 5 | Cloud Shell | Download `lambda-deploy.zip` (Part C) |
| 6 | AWS Console | Upload zip to Lambda (Part D) |

You do **not** need to reinstall Python 3.12 every time unless you start a fresh Cloud Shell home directory.

---

## Optional — Deploy zip from Cloud Shell without downloading

If you prefer **not** to download/upload manually, set your function name and run:

```bash
export LAMBDA_FUNCTION_NAME="YOUR_FUNCTION_NAME"
export AWS_REGION=ap-southeast-2

aws lambda update-function-code \
  --function-name "$LAMBDA_FUNCTION_NAME" \
  --zip-file fileb://lambda-deploy.zip \
  --region ap-southeast-2

aws lambda wait function-updated \
  --function-name "$LAMBDA_FUNCTION_NAME" \
  --region ap-southeast-2
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `No module named 'mangum'` (or similar) after upload | Rebuild zip; ensure `pip install -t package` ran and you zipped **contents of `package/`**, not the parent folder only. |
| `Unable to import module 'lambda_handler'` | Handler must be `lambda_handler.handler`; zip root must contain `lambda_handler.py` at top level inside the zip. |
| Unzipped size too large | Remove `package/` and old zips before rebuild; do not commit `venv/` into the upload zip. |
| Download file — “file not found” | Run `pwd` and `ls lambda-deploy.zip`; use exact path in Download file dialog. |
| AI returns 500 | Set `GROQ_API_KEY_1` on Lambda; check **Monitor → Logs** in CloudWatch. |
| `python3.12` not found | `sudo dnf update -y` then retry install; or use `pyenv` (see AWS re:Post for AL2023). |

---

## Quick command cheat sheet (Cloud Shell)

```bash
# After upload & unzip — from folder with main.py
sudo dnf install -y python3.12 python3.12-pip
rm -rf package lambda-deploy.zip && mkdir -p package
python3.12 -m pip install -r requirements.txt -t package --upgrade
cp main.py lambda_handler.py package/ && cp -r utils package/
cd package && zip -r ../lambda-deploy.zip . && cd ..
ls -lh lambda-deploy.zip
pwd   # use this path + /lambda-deploy.zip for Download file
```

---

## Related files in this repo

| File | Purpose |
|------|---------|
| `lambda_handler.py` | Lambda entry (`handler`) |
| `main.py` | FastAPI routes |
| `requirements.txt` | Pip dependencies |
| `buildspec.yml` | Same build steps for CodeBuild (optional automation) |
