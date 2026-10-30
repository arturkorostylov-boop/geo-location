const coordinatesForm = document.querySelector('#coordinatesForm')
const latitudeInput = document.querySelector('#latitude')
const longitudeInput = document.querySelector('#longitude')


coordinatesForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    // const latitude = latitudeInput.value.trim()
    // const longitude = longitudeInput.value.trim()
    const latitude = latitudeInput.value
    const longitude = longitudeInput.value
    console.log(latitude, longitude);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=uk&zoom=18`


    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('error of getting data')
        }
        console.log(response);

        const data = await response.json()
        document.querySelector('#result').innerHTML = `
        <h2 class="changa-one-regular">Result</h2>
        <p><strong>Address:</strong> ${data.display_name}</p>
        <p><strong>City:</strong> ${data.address.city}</p>`
    } catch (error) {
        console.error('failed to recieve address', error)
    }
})

latitudeInput.focus()


// add iframe with map