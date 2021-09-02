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
        console.log(result)
        $('#loading').removeClass('none');
        if (result == null) {
            alert('Choose file please!')
        } else {
            var ipfs = await window.IpfsHttpClient.create({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https'
            })
            await ipfs.add(result).then((data) => {
                $('#image-show').attr('src', `https://cloudflare-ipfs.com/ipfs/${data.path}`)
                var string = `
                    <p><a href="ipfs://${data.path}">ipfs://${data.path}</a></p>
                    <p><a href="https://ipfs.infura.io/ipfs/${data.path}">https://ipfs.infura.io/ipfs/${data.path}</a></p>
                    <p><a href="https://cloudflare-ipfs.com/ipfs/${data.path}">https://cloudflare-ipfs.com/ipfs/${data.path}</a></p>
                `
                $('#url').append(string)
                $('#loading').addClass('none');
            })
        }
    })
    function showImage (file) {
        var type = file.type.includes('image') ? 'image' : 'video'
        const reader = new window.FileReader() 
        reader.readAsDataURL(file)
        reader.onload = () => {
            if (type == 'video') {
                $('#video-show').attr('src', reader.result)
                $('#video-show').removeClass('d-none')
                $('#image-show').addClass('d-none')
            } else {
                $('#image-show').attr('src', reader.result)
                $('#image-show').removeClass('d-none')
                $('#video-show').addClass('d-none')
            }
        }
    }
})