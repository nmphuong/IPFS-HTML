$(document).ready(() => {
    var result = null
    $('#btn-submit').addClass('btn-disabled')
    $("#file").on('change', function() {
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        showImage(file)
        reader.readAsArrayBuffer(file)
        reader.onloadend = (e) => {
            result = reader.result
        }
        $('#btn-submit').removeClass('btn-disabled')
    })
    $('#btn-submit').on("click", async function() {
        event.preventDefault()
        if (result == null) {
            alert('Choose file please!')
        } else {
            var ipfs = await window.IpfsHttpClient.create({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https'
            })
            var data = await ipfs.add(result)
            $('#image-show').attr('src', `https://cloudflare-ipfs.com/ipfs/${data.path}`)
            var string = `
                <p><a href="ipfs://${data.path}">ipfs://${data.path}</a></p>
                <p><a href="https://ipfs.infura.io/ipfs/${data.path}">https://ipfs.infura.io/ipfs/${data.path}</a></p>
                <p><a href="https://cloudflare-ipfs.com/ipfs/${data.path}">https://cloudflare-ipfs.com/ipfs/${data.path}</a></p>
            `
            $('#url').append(string)
        }
    })
    function showImage (file) {
        const reader = new window.FileReader() 
        reader.readAsDataURL(file)
        reader.onload = () => {
            $('#image-show').attr('src', reader.result)
        }
    }
})