/**
 * Client-side JavaScript for our Serverless App
 * 
 * @author Matheus Freitas
 * @email msfbr.00@gmail.com
 */
((vanillaJS) => {
    // Please, use your recaptcha site key
    let googleRecaptchaSiteKey = '6Lf5BIoaAAAAAIGANnsvRam_b9dVwki8Sbub_hj6';
    let shorterUrl = document.querySelector('#shortened-url');

    // Selectors
    let buttonShortUrl = document.querySelector('#button-short-url');
    let inputShortUrl = document.querySelector('#input-short-url');
    let modalConfirmationNotARobot = document.querySelectorAll('.modal-confirmation-group');
    let buttonNotARobot = document.querySelector('#button-not-a-robot');
    let pageOverlay = document.querySelector('#overlay');
    let whenSuccessfullyShortedElements = document.querySelectorAll('.when-successfully-shorted');
    let whenFailedShortedElements = document.querySelectorAll('.when-shorted-failed');
    let inputCopyShortenedUrl = document.querySelector('#shortened-url-input');
    let buttonCopy = document.querySelector('#button-copy');

    /**
     * Open the confirmation modal before short an URL so
     * we avoid bots and flood.
     */
     function openConfirmationModal() {
        if(!inputShortUrl.value.length) {
            return displayError('Fill the URL before continue.');
        }

        modalConfirmationNotARobot.forEach((item) => {
            item.classList.remove("hidden");
            item.classList.add("opacity-100");
        });
    }

    /**
     * Closes the confirmation modal.
     */
     function closeConfirmationModal() {
        modalConfirmationNotARobot.forEach((item) => {
            item.classList.add("hidden");
            item.classList.remove("opacity-100");
        });

        whenSuccessfullyShortedElements.forEach((item) => {
            item.classList.add('hidden');
        });
     
        buttonNotARobot.classList.remove('hidden');
    
    }

    /**
     * Confirms that the user isn't a bot using Google reCaptcha Api.
     */
    function confirmImNotARobot() {
        buttonNotARobot.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" class="animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        `;

        grecaptcha.ready(function() {
            grecaptcha.execute(googleRecaptchaSiteKey, { action: 'submit' }).then(function(token) {
                fetch('/app/short-url', { 
                    method: 'POST', 
                    body: JSON.stringify({
                        url: inputShortUrl.value,
                        token: token
                    }) 
                }).then((response) => response.json()).then((data) => {
                    return updateUIWithShorterInformation(data);
                });
            });
        });
    }

    /**
     * Display an error for the user. Right now it'll use alert
     * but in the next versions it'll become a custom alert.
     * 
     * @param {String} Message to be displayed 
     * @return Void
     */
    function displayError(message) {
        return alert(message);
    }
    
    /**
     * Updates the UI with the shorter URL information.
     * 
     * @param {Object} Information about the url
     * @return void
     */
    function updateUIWithShorterInformation(data) {
        if(data.success) {
            buttonNotARobot.classList.add('hidden');
            buttonNotARobot.innerHTML = 'I\'m not a robot';

            whenSuccessfullyShortedElements.forEach((item) => {
                item.classList.remove('hidden');
            });
        }

        shorterUrl.innerHTML = data.shorterUrl;
        inputCopyShortenedUrl.value = data.shorterUrl;
    }

    function copyShortenedUrl() {
        inputCopyShortenedUrl.select();
        document.execCommand("copy");
        console.log('here')
    }

    /**
     * Event triggers
     */
    buttonShortUrl.addEventListener('click', openConfirmationModal);
    buttonNotARobot.addEventListener('click', confirmImNotARobot);
    pageOverlay.addEventListener('click', closeConfirmationModal);
    pageOverlay.addEventListener('click', closeConfirmationModal);
    buttonCopy.addEventListener('click', copyShortenedUrl);

})('Vanilla.js Rocks!');