<!DOCTYPE html>
<html>

<head>
    <script src="jquery.js"></script>
    <style>
        .fileName {
            width: 150px;
            display: inline-block;
        }

        .message {
            width: 100px;
            display: inline-block;
        }
    </style>
    <script>
        $(document).ready(function () {
            var conn = new WebSocket('ws://167.99.199.12:8090');
            conn.onopen = function (e) {
                console.log("Connection established!");
                $('#message').text('Socket established');
            };

            conn.onmessage = function (e) {
                console.log(e.data);
                var msg = JSON.parse(e.data);
                $('#log').append(`<div><span class='fileName'>${msg.file}</span><span class='message'>${msg.text}</span></div>`)
            };
        });
    </script>
</head>

<body>
    <div id="message"></div>
    <div id="log">
        <!-- <div><span class='fileName'>${msg.file}</span><span class='message'>${msg.file}</span></div> -->
    </div>
</body>

</html>