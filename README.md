<div align="center">


# NeuroSight AI

**AI-powered brain tumor detection, built for clinicians — not just for a demo.**

<sub>Real-time MRI analysis · Dual-model YOLOv8 · Zero-disk inference pipeline</sub>

<br/>

![Next.js](https://img.shields.io/badge/-Next.js%2016-black?style=flat-square&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![YOLOv8](https://img.shields.io/badge/-YOLOv8-3DDC84?style=flat-square)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/-MIT%20%2B%20AGPL--3.0-orange?style=flat-square)

</div>

<br/>


<br/>

## 💡 Why I Built This

Most tumor-detection demos stop at "model gets 90% mAP, cool." NeuroSight AI was built to answer the next question a real hospital would ask: *can a radiologist actually use this without it slowing them down or leaking patient data?*

That constraint shaped almost every decision in this repo — from the in-memory-only image pipeline to the dual-model toggle that lets a user trade speed for depth mid-workflow.

<br/>

## 🧩 How It Works

```
MRI Upload → Byte Stream (RAM only) → YOLOv8 Inference → Boxes + Confidence → Canvas Overlay → Result Discarded
```

No image is ever written to disk, cached, or logged — the scan exists only for the milliseconds it takes to run inference, then it's gone.

<br/>

## 🔍 Detection Classes

| Tumor Type | Description |
|---|---|
| 🔴 **Glioma** | Tumors arising from glial cells, often infiltrative |
| 🔵 **Meningioma** | Typically slow-growing, arises from the meninges |
| 🟡 **Pituitary** | Located at the base of the brain, hormone-affecting |

<br/>

## ⚖️ Nano vs. Medium — The Trade-off

<table>
<tr><th></th><th>🟢 Nano</th><th>🟣 Medium</th></tr>
<tr><td><b>Speed</b></td><td>~0.04–0.08s</td><td>~0.12–0.20s</td></tr>
<tr><td><b>Size</b></td><td>~6 MB</td><td>~52 MB</td></tr>
<tr><td><b>mAP50</b></td><td>~91.1%</td><td>~91.2%</td></tr>
<tr><td><b>Best for</b></td><td>Fast triage, edge devices</td><td>Blurry / ambiguous margins</td></tr>
</table>

> Both models land at near-identical mAP50 because tumor masses are visually distinct — the Medium model earns its size mainly on the hard edge cases, not the average one.

<br/>

## 🔌 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/predict` | `POST` | Runs inference on an uploaded scan, returns bounding boxes + confidence |
| `/health` | `GET` | Backend liveness check |
| `/model-info` | `GET` | Lists currently loaded models in memory |

<br/>

## 🔒 Security & Privacy Design

- **No disk writes** — uploaded scans are processed entirely as in-memory byte streams
- **No logging of image data** — only metadata (inference time, model used) is ever logged
- **Stateless backend** — no session or patient data persisted between requests
- **CORS-scoped API** — cross-origin access restricted to the configured frontend origin

<br/>

## 🧠 Tech Decisions Worth Mentioning

- Chose **YOLOv8** over a classification-only CNN because bounding boxes give clinicians spatial context, not just a label
- Built the **model toggle at the frontend layer** rather than auto-selecting, since a clinician may deliberately want the deeper model for a borderline case
- Used **Canvas rendering** instead of SVG overlays for bounding boxes — significantly faster redraw when a user re-uploads or zooms

<br/>

## 🗺️ What's Next

- [ ] DICOM format support (currently JPEG/PNG/WebP only)
- [ ] Grad-CAM overlays for model explainability
- [ ] Multi-slice 3D volume support
- [ ] Dockerized deployment for one-click hosting

<br/>

## 📜 License & Disclaimer

Frontend/backend under **MIT**, YOLOv8 under **AGPL-3.0**.

> ⚠️ **For research and educational use only.** Not FDA-approved. Not a substitute for professional medical diagnosis.

<br/>

---

<div align="center">

Built by **Vansh Gupta** 

</div>
