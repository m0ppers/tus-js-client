var upload = null
var stopBtn = document.querySelector("#stop-btn")
var resumeCheckbox = document.querySelector("#resume")
var input = document.querySelector("input[type=file]")
var progress = document.querySelector(".progress")
var progressBar = progress.querySelector(".bar")
var alertBox = document.querySelector("#support-alert")

if(!tus.isSupported) {
    alertBox.className = alertBox.className.replace("hidden", "")
}

stopBtn.addEventListener("click", function(e) {
    e.preventDefault()

    if(upload) {
        upload.abort()
    }
})

input.addEventListener("change", function(e) {
    var file = e.target.files[0]
    console.log("selected file", file)

    stopBtn.classList.remove("disabled")

    var options = {
        endpoint: "http://localhost:1080/files/",
        resume: !resumeCheckbox.checked,
        onError: function(error) {
            reset()
            alert("Failed because: " + error)
        },
        onProgress: function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            progressBar.style.width = percentage + "%"
            console.log(bytesUploaded, bytesTotal, percentage + "%")
        },
        onSuccess: function() {
            reset()
            var anchor = document.createElement("a")
            anchor.textContent = "Download " + upload.file.name + " (" + upload.file.size + " bytes)"
            anchor.href = upload.url
            anchor.className = "btn btn-success"
            e.target.parentNode.appendChild(anchor)
        }
    }

    upload = new tus.Upload(file, options)
    upload.start()
})

function reset() {
    input.value = ""
    stopBtn.classList.add("disabled")
    progress.classList.remove("active")
}
