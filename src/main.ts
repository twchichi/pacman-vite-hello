const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (ctx) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ff0";
  ctx.font = "48px monospace";
  ctx.textAlign = "center";
  ctx.fillText("Hello Canvas!", canvas.width / 2, canvas.height / 2);
}
