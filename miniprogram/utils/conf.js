/*
Tencent is pleased to support the open source community by making Face-2-Face Translator available.

Copyright (C) 2018 THL A29 Limited, a Tencent company. All rights reserved.

Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

let language = [
  {
    id: 0,
    lang_name: "长按说话",
    lang_content: "zh_CN",
    lang_to: ["en_US",],
    max_length: 300,
    source_language: "输入文字",
    target_language: "输出文字",
    hold_talk: "",
    keyboard_input: "键盘输入",
    type_here: "输入文字",
    bg_content: "请输入翻译内容",
    record_failed: "录制失败",
    recognize_nothing: "请说话",
    time_left: "录音输入倒数",
    text_left: "剩余文本长度",
    prompt_time: "提示秒数",
    upload_failed: "上传失败",
    translating: "翻译中",
    text_limit: "限制长度",
    input_tip: "请输入有效文字",
    request_failed: "请求失败",
    delete_tip: "删除该项",
    cancel: "取消",
    bubble_tip: "请输入文本",
    bg_bubble: "正在听你说话",
    copy_source_text: "复制原文",
    copy_target_text: "复制译文",
    delete_item: "删除",
    exceed_network: "网络请求失败",
    retry_network: "尝试重新连接",
    wait_last_record: "请等待翻译结束",
    access_auth: "请检查权限",
    access_network: "网络错误",
    login: "登录",
  }
]

module.exports = {
  language: language
}
