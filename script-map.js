const coordinatesForm = document.querySelector('#coordinatesForm')
const latitudeInput = document.querySelector('#latitude')
const longitudeInput = document.querySelector('#longitude')
const result = document.querySelector('#result')
const detectLocationButton = document.querySelector('#detectLocation')

detectLocationButton.addEventListener('click',()=>{
    if (!navigator.geolocation) {
        result.textContent = 'your browser does not support finding of place'
        return
    }else{
        console.log(navigator.geolocation);
        
    }
    result.textContent = 'waiting for access and detect place'
    navigator.geolocation.getCurrentPosition(
        ({coords})=>{
            latitudeInput.value = coords.latitude
            longitudeInput.value = coords.longitude
            
        },
        (error)=>{
            const messages = {
                1:'access to location is denied',
                2:'error trying to find place',
                3:'time of finding place has ended'
            }
            result.textContent = messages[error.code] || 'error trying to find place'
        },
        {
            enableHighAccuracy:true,
            timeout:10000,
            maximumAge:60000

        }
    )
})

coordinatesForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const latitude = Number(latitudeInput.value)
    const longitude = Number(longitudeInput.value)
    

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=uk&zoom=18`


    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('error of getting data')
        }
        console.log(response);

        const data = await response.json()
        if (!latitude || !longitude) {
            result.innerHTML = 'you have not input coordinates'
            return
        }
        result.innerHTML = `
        <h2 class="changa-one-regular">Result</h2>
        <p><strong>Address:</strong> ${data.display_name}</p>
        <p><strong>City:</strong> ${data.address.city}</p>`

        const box = [
            Math.max(-180, longitude - 0.05), 
            Math.max(-90, latitude - 0.03), 
            Math.min(180, longitude + 0.05), 
            Math.min(90, latitude + 0.03), 
        ].join(',')

        const mapURL = new URL('https://www.openstreetmap.org/export/embed.html')
        mapURL.search = new URLSearchParams({
            box,
            layer:'mapnik',
            marker:`${latitude},${longitude}`
        }).toString()

        const map = document.createElement('iframe')
        map.src = mapURL.href
        map.title = `Map: ${data.address.city}`
        map.loading = 'lazy'

        result.append(map)
    } catch (error) {
        console.error('failed to recieve address', error)
    }
})


latitudeInput.focus()

// add iframe with map