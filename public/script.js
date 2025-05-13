let motionListener = null;

async function startMotion(contextLabel) {
  const context = {
    label: contextLabel,
  };
  await fetch("/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context }),
  });
  console.log(
    `Successfully created new dataset for context '${context.label}'`
  );
}

async function addMotion(event) {
  const sample = {
    timeStamp: Date.now(),
    alpha: event.alpha,
    beta: event.beta,
    gamma: event.gamma,
  };
  await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sample }),
  });
  console.log(`Successfully added datapoint ${JSON.stringify(sample)}`);
}

async function completeMotion() {
  await fetch("/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  console.log(
    "Successfully completed data collection for the current context."
  );
}

document
  .getElementById("contextActiveSwitch")
  .addEventListener("change", async function (e) {
    if (!e.target.checked) {
      if (motionListener) {
        window.removeEventListener("deviceorientation", motionListener);
        console.log("Removed motion listener.");
      }
      await completeMotion();
      return;
    }

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response !== "granted") {
          alert("Permission denied for device motion.");
          e.target.checked = false;
          return;
        }
      } catch (err) {
        alert("DeviceMotion permission error: " + err);
        e.target.checked = false;
        return;
      }
    }

    const currentContextLabel = document.getElementById("contextInput").value;
    await startMotion(currentContextLabel);

    motionListener = addMotion;
    window.addEventListener("deviceorientation", motionListener);
    console.log("Registered motion listener.");
  });
