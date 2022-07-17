'use strict';

var fs = require('fs');

class HandleThemes {
    getFolderFiles(path) {
        fs.readdir(path, (errStatus, fileList) => {
            if (errStatus !== null) {
                console.log("文件读取失败, 错误原因: ", errStatus);
                return;
            }
            console.log("文件读取成功", fileList);
        });
    }
}

const handles = new HandleThemes();
handles.getFolderFiles("/Users/didi/Projects");
