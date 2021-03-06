<!DOCTYPE html>
<html>

<head>
    <script src="jquery.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
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
        var port = 8090;
        $(document).ready(function () {
            var conn = new WebSocket(`wss://localhost:${port}`);
            conn.onopen = function (e) {
                console.log("Connection established!");
                // $('#message').text('Socket established');
            };

            conn.onmessage = function (e) {
                console.log(e.data);
                var msg = JSON.parse(e.data);
                var id = msg.file.replace('.log', '');
                $(`#log${id}`).text(msg.text);
            };
        });
        // $('#getPort').click(() => {
        //     var user = $('#username').val();

        // })

    </script>
</head>

<body>
    <!-- user name: <input id="username" placeholder="user name" value="user1">
    <button id="getPort"></button> -->
    <div id="message"></div>
    <table id="log" class="table table-bordered" style="width: 500px;margin:auto;margin-top: 120px;">
        <tr>
            <td>File Name</td>
            <td>File Content</td>
        </tr>
        <tr>
            <td>log1</td>
            <td id="log1"></td>
        </tr>
        <tr>
            <td>log2</td>
            <td id="log2"></td>
        </tr>
        <tr>
            <td>log3</td>
            <td id="log3"></td>
        </tr>
        <tr>
            <td>log4</td>
            <td id="log4"></td>
        </tr>
        <tr>
            <td>log5</td>
            <td id="log5"></td>
        </tr>
        <tr>
            <td>log6</td>
            <td id="log6"></td>
        </tr>
        <tr>
            <td>log7</td>
            <td id="log7"></td>
        </tr>
        <tr>
            <td>log8</td>
            <td id="log8"></td>
        </tr>
        <tr>
            <td>log9</td>
            <td id="log9"></td>
        </tr>
        <tr>
            <td>log10</td>
            <td id="log10"></td>
        </tr>

    </table>
</body>

</html>