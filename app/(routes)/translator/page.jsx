"use client";

import languages from "../../../data/languages.json";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { ArrowLeftRight, Copy, Volume2 } from "lucide-react";
import { FormEvent, useState } from "react";

export default function TranslatorPage() {
  const [translatedFrom, setTranslatedFrom] = useState("");
  const [translatedTo, setTranslatedTo] = useState("");
  const [toTranslate, setToTranslate] = useState("");
  const [translation, setTranslation] = useState("");

  const options = {
    method: "GET",
    url: "https://translated-mymemory---translation-memory.p.rapidapi.com/get",
    params: {
      langpair: `${translatedFrom}|${translatedTo}`,
      q: toTranslate,
    },
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_TRANSLATOR_API_KEY,
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_TRANSLATOR_HOST_KEY
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.request(options);
      setTranslation(response?.data);
      console.log(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleToTranslateSpeech = () => {
    if(toTranslate) {
      const utterance = new SpeechSynthesisUtterance(toTranslate)
      utterance.lang = translatedFrom
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleTranslationSpeech = () => {
    if(translation) {
      const utterance = new SpeechSynthesisUtterance(translation.responseData.translatedText)
      utterance.lang = translatedTo
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 h-screen mx-4 md:mx-10 my-5"
      >
        <div className="flex gap-4 w-full items-center">
          <Select defaultValue="en" value={translatedFrom} onValueChange={(value) => setTranslatedFrom(value)}>
            <SelectTrigger className="w-full">
              <SelectValue defaultValue={"en"} placeholder="English" />
            </SelectTrigger>
            <SelectContent className="h-[300px]">
              {languages.map((language) => (
                <SelectItem key={language.ISO} value={language.ISO}>
                  {language.language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ArrowLeftRight onClick={() => {}} className="w-8 h-8" />
          <Select defaultValue="es" value={translatedTo} onValueChange={(value) => setTranslatedTo(value)}>
            <SelectTrigger className="w-full">
              <SelectValue defaultValue={"es"} placeholder="Spanish" />
            </SelectTrigger>
            <SelectContent className="h-[300px]">
              {languages.map((language) => (
                <SelectItem key={language.ISO} value={language.ISO}>
                  {language.language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-4 md:w-full sm:flex sm:w-full sm:flex-wrap md:flex-nowrap">
          <div className="flex w-full border rounded-lg dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-4 w-full p-4">
              <div className="flex gap-4 w-full h-[264px] md:h-[216px]">
                <textarea
                  value={toTranslate}
                  onChange={(e) => setToTranslate(e.target.value)}
                  className="resize-none bg-transparent outline-none w-full border-none"
                />
                <Button variant="ghost">
                  <Copy className="w-5 h-5" onClick={toTranslate && (() => navigator.clipboard.writeText(toTranslate))} />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <Button variant="ghost">
                  <Volume2 onClick={handleToTranslateSpeech}/>
                </Button>
                <Button variant="outline" type="submit">
                  Translate
                </Button>
              </div>
            </div>
          </div>

          <div className="flex w-full rounded-lg bg-slate-100 dark:bg-slate-950 mb-5">
            <div className="flex flex-col gap-4 w-full p-4">
              <div className="flex gap-4 w-full h-[264px] md:h-[216px]">
                <textarea
                  value={translation && translation.responseData.translatedText}
                  className="resize-none bg-transparent outline-none w-full border-none"
                  readOnly
                />
                <Button variant="ghost">
                  <Copy className="w-5 h-5" onClick={translation && (() => navigator.clipboard.writeText(translation.responseData.translatedText))}/>
                </Button>
              </div>
              <Button variant="ghost" className="w-fit">
                <Volume2 onClick={handleTranslationSpeech}/>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
