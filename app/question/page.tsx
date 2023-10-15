"use client";

import LaunchIcon from "@mui/icons-material/Launch";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import ContentDisplay from "../_components/ContentDisplay";
import { WarnTooltip } from "../_components/WarnTooltip";

export default function Question() {
  // recognition
  const [recognition, setRecognition] = useState<any>();

  // ローディング中を制御
  const [isLoading, setIsLoading] = useState(false);

  // 聞き取り中か否かを制御
  const [isListening, setIsListening] = useState(false);

  // 聞き取った内容を制御
  const [content, setContent] = useState("");

  // 質問内容を制御
  const [text, setText] = useState("");

  useEffect(() => {
    // 言語を聞き取る用のAPIを使用
    const windows: any = window;
    const SpeechRecognition =
      windows.SpeechRecognition || windows.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // 日本語を認識するようにする
    recognition.lang = "ja-JP";

    // 聞き取った結果を処理する
    recognition.onresult = (event: any) => {
      // この場所に聞き取った結果が入る
      const speech = event.results[0][0].transcript;

      // 内容確認
      const agree = confirm(`この内容で間違いないですか？\n ${speech}`);

      // Textをセット
      if (agree) {
        sendQuestion(speech);
      } else {
        return setText("");
      }
    };

    /**
     * 音声認識終了時の挙動
     */
    recognition.onend = (e: any) => {
      // リッスンを終了
      setIsListening(false);
    };

    /**
     * エラー時の挙動
     */
    recognition.onerror = (e: any) => {
      if (e.error === "no-speech") return alert("何かお話をしてください。");
      return alert("うまく聞き取れませんでした。");
    };

    setRecognition(recognition);
  }, []);

  /**
   * questionを叩くapiへデータを送り、結果を受け取る処理
   */
  const sendQuestion = async (text: string) => {
    try {
      // ローディング開始
      setIsLoading(true);

      // questionを叩くapiへデータを送る
      const answer = await fetch("/api/question", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      // 結果を受け取る
      const answerJson = await answer.json();
      setContent(answerJson.text);
    } catch (e) {
      console.log("Node側への接続中にエラーが起こりました。");
      setContent("");
    } finally {
      // ローディング終了
      setIsLoading(false);
    }
  };

  /**
   * リッスンボタン押下時の処理
   */
  const handleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // リッスン開始
      recognition.start();
    } else {
      // リッスン終了
      recognition.stop();
    }
  };

  /**
   * 送信ボタン押下時の内容
   */
  const handleSubmit = (e: any) => {
    e.preventDefault();

    // 質問をGPTに投げる
    sendQuestion(text);
  };

  return (
    <Grid container spacing={4} sx={{ height: "100vh", p: 3 }}>
      <Grid
        item
        xs={12}
        md={6}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={8}
      >
        <Grid item>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="h4">音声で質問する</Typography>
              <WarnTooltip />
            </Box>
            <Button
              startIcon={<MicIcon />}
              onClick={handleListen}
              variant="contained"
            >
              {isListening ? "聞き取り中" : "ここを押して話してね"}
            </Button>
          </Box>
        </Grid>

        <Grid item>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Typography variant="h4">文章で質問する</Typography>
              <WarnTooltip />
            </Box>
            <form onSubmit={handleSubmit}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="テキスト"
                  variant="outlined"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SendIcon />}
                >
                  送信
                </Button>
              </Stack>
            </form>
          </Box>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        container
        alignItems="center"
        justifyContent="center"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            <Link
              href={"https://chat.openai.com/"}
              style={{ color: "#1976d2" }}
            >
              GPT
            </Link>
            <LaunchIcon /> の返答
          </Typography>
          {isLoading ? (
            <CircularProgress sx={{ mt: 2 }} />
          ) : (
            <ContentDisplay
              content={content ? content : "質問をしてみよう！"}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
