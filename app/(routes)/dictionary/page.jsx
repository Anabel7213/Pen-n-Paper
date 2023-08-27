"use client";

import { Button } from "@/components/ui/button";
import { useState, FormEvent, Key } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { Volume2 } from "lucide-react";

export default function DictionaryPage() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState();

  const options = {
    method: "POST",
    url: "https://xf-english-dictionary1.p.rapidapi.com/v1/dictionary",
    params: {
      selection: word.toLowerCase(),
      synonyms: "true",
      audioFileLinks: "true",
      pronunciations: "true",
      relatedWords: "false",
      antonyms: "true",
    },
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_DICTIONARY_API_KEY,
      "X-RapidAPI-Host": process.env.NEXT_PUBLIC_DICTIONARY_HOST_KEY,
    },
    data: {
      selection: word.toLowerCase(),
      textAfterSelection: "",
      textBeforeSelection: "",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.request(options);
      setDefinition(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };
  const cleanHTML = (htmlString) => {
    return htmlString.replace(/<\/?(i|b|br)\b[^>]*>/gi, "");
  };

  const toExclude = [
    "now chiefly dialectal",
    "now poetic, literary",
    "dialectal",
    "obsolete",
    "Canada",
    "humorous",
    "archaic",
    "nonstandard",
    "-",
    "heraldry",
  ];

  return (
    <>
      <div className="flex flex-col mx-10">
        {/* this can be substituted with the onValueChange in my input field for it
        to make more sense */}
        <div
          className={
            !definition ? "flex h-screen" : "flex w-full h-fit mt-5 self-end"
          }
        >
          <form
            onSubmit={handleSubmit}
            className={
              definition
                ? "flex gap-4 flex-col m-auto w-full"
                : "flex gap-4 flex-col m-auto"
            }
          >
            <div className="flex gap-3 border p-1 pl-4 rounded-lg">
              <input
                className={
                  definition
                    ? "outline-none border-none bg-transparent w-full"
                    : "outline-none border-none bg-transparent"
                }
                placeholder="Any word..."
                type="text"
                value={word}
                onChange={(e) =>
                  setWord(e.target.value)
                }
              />
              <Button variant="ghost" className="w-fit">
                Discover
              </Button>
            </div>
          </form>
        </div>
        <div className="OUTPUT flex flex-col">
          {definition ? (
            definition.items ? (
              <>
                <div className="MAIN flex flex-col gap-2 my-4">
                  <h1 className="font-black text-6xl flex items-center gap-4 capitalize">
                    {definition.target}
                    <Volume2
                      onClick={() => {
                        const audio = new Audio(
                          `https://download.xfd.plus/xfed/audio/${
                            definition.pronunciations[0].entries[0].audioFiles?.find(
                              (file) => file?.link
                            )?.link
                          }`
                        );
                        audio.play();
                      }}
                      className="h-8 w-8 cursor-pointer"
                    />
                  </h1>
                  <p>
                    {definition.items && definition.items.length > 0
                      ? definition.items[0].partOfSpeech
                      : null}
                    <span>
                      {definition &&
                      definition.items &&
                      definition.items.length > 0 &&
                      definition.pronunciations &&
                      definition.pronunciations.length > 0 &&
                      definition.pronunciations[0].entries &&
                      definition.pronunciations[0].entries.length > 0 &&
                      definition.pronunciations[0].entries[0].textual &&
                      definition.pronunciations[0].entries[0].textual.length > 0
                        ? definition.pronunciations[0].entries[0].textual[0].pronunciation
                            .split(":")
                            .pop()
                            .trim()
                        : null}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {definition.items &&
                    definition.items[0].inflectionalForms ? (
                      definition.items[0].inflectionalForms.map(
                        (
                          inflectionalForm,
                          index
                        ) => (
                          <div key={index} className="flex gap-4">
                            {inflectionalForm.forms
                              .slice(0, 4)
                              .filter(
                                (form) => !form.includes(toExclude)
                              )
                              .map((form, subIndex) => (
                                <div
                                  key={subIndex}
                                  className={
                                    !form
                                      ? "hidden"
                                      : "flex py-2 px-4 rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                                  }
                                >
                                  {form}
                                </div>
                              ))}
                          </div>
                        )
                      )
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex py-2 px-4 rounded-md bg-pink-100">
                            🥹
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>No derivatives found!</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
                <Separator />

                <div className="md:flex gap-4 sm:flex my-4 md:flex-nowrap sm:flex-wrap mb-10">
                  <div className="FIRST COL md:flex md:flex-col flex flex-col md:w-[70%] sm:flex gap-4 sm:flex-col sm:w-full">
                    <div className="flex flex-col gap-2">
                      <h1 className="font-bold">Definitions:</h1>
                      {definition.items && definition.items.length > 0
                        ? definition.items.map(
                            (
                              item,
                              index
                            ) => {
                              const filteredDefinitions = item.definitions
                                .slice(0, 2)
                                .filter(
                                  (singleDefinition) => {
                                    const modifiedDefinition =
                                      singleDefinition.definition.toLowerCase();
                                    return !toExclude.some((term) =>
                                      modifiedDefinition.includes(
                                        term.toLowerCase()
                                      )
                                    );
                                  }
                                );
                              if (filteredDefinitions.length > 0) {
                                return (
                                  <div
                                    key={index}
                                    className="flex flex-col gap-2"
                                  >
                                    {filteredDefinitions.map(
                                      (
                                        definition,
                                        subIndex
                                      ) => {
                                        return (
                                          <li key={subIndex}>
                                            {cleanHTML(definition.definition)}
                                          </li>
                                        );
                                      }
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }
                          )
                        : null}
                    </div>
                    <Separator />

                    <div className="flex flex-col">
                      <h1 className="font-bold mb-1">Examples:</h1>
                      {definition.items && definition.items.length > 0
                        ? definition.items.map(
                            (
                              item,
                              index
                            ) => (
                              <div key={index}>
                                {item.definitions.map(
                                  (
                                    definition,
                                    subIndex
                                  ) => (
                                    <div
                                      key={subIndex}
                                      className="flex flex-col gap-2"
                                    >
                                      {definition.examples &&
                                        definition.examples.length > 0 && (
                                          <div className="flex flex-col gap-2">
                                            {definition.examples
                                              .filter(
                                                (example) =>
                                                  !/<sup>.*?<\/sup>/.test(
                                                    example
                                                  ) &&
                                                  !/\[.*?\]|\(.*?\)|\).*?\(/.test(
                                                    //read more about it, practice and truly understand how it works
                                                    example
                                                  )
                                              )
                                              // .slice(0,5) //this limits the number of example arrays it iterates over
                                              .map(
                                                (example, subSubIndex) =>
                                                  subSubIndex < 1 &&
                                                  subIndex < 4 && ( //i need to limit the number of individual examples
                                                    <li
                                                      key={subSubIndex}
                                                      className="my-1"
                                                    >
                                                      {cleanHTML(example)}
                                                    </li>
                                                  )
                                              )}
                                          </div>
                                        )}
                                    </div>
                                  )
                                )}
                              </div>
                            )
                          )
                        : null}
                    </div>
                  </div>

                  <div className="SECOND COL md:flex md:flex-col flex flex-col gap-4 md:w-[30%] sm:flex sm:flex-col sm:w-full">
                    <div className="flex flex-col gap-2 flex-wrap">
                      <div className="flex flex-col gap-4">
                        <h1 className="font-bold md:self-end">Synonyms:</h1>
                        <div className="flex gap-2 flex-wrap md:justify-end">
                          {definition.items &&
                          definition.items.length > 0 &&
                          definition.items[0].synonyms ? (
                            definition.items[0].synonyms.map(
                              (synonym, index) => {
                                const chunk = synonym.split(":");
                                const modifiedChunk = cleanHTML(
                                  chunk[chunk.length - 1].trim()
                                );
                                const words = modifiedChunk
                                  .split(",")
                                  .map((word) => word.trim().replace(/\)$/, ""))
                                  .map((word) => word.split("/")[1] || word);
                                let renderedCount = 0; // Counter for rendered spans

                                return (
                                  <div key={index} className="flex gap-2">
                                    {words.map((word, subIndex) => {
                                      if (
                                        renderedCount < 2 &&
                                        !/[a-z0-9)]\s*\(/i.test(word) &&
                                        !/\)\s*[a-z0-9]/i.test(word) &&
                                        word.toLowerCase().indexOf("see") ===
                                          -1 && // Exclude "see"
                                        !word.includes("&") // Exclude "&"
                                      ) {
                                        renderedCount++;
                                        return (
                                          <span
                                            onClick={() =>
                                              setWord(cleanHTML(word))
                                            }
                                            key={subIndex}
                                            className="cursor-pointer flex py-2 px-4 rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                                          >
                                            {cleanHTML(word)}
                                          </span>
                                        );
                                      }
                                      return null;
                                    })}
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="flex py-2 px-4 rounded-md bg-yellow-100">
                                  🥲
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Nothing found!</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <h1 className="font-bold md:self-end">Antonyms:</h1>
                        <div className="flex gap-2 flex-wrap md:justify-end">
                          {definition.items &&
                          definition.items.length > 0 &&
                          definition.items[0].antonyms ? (
                            definition.items[0].antonyms.map(
                              (antonym, index) => {
                                const chunk = antonym.split(":");
                                const modifiedChunk = cleanHTML(
                                  chunk[chunk.length - 1].trim()
                                );
                                const words = modifiedChunk
                                  .split(",")
                                  .map((word) => word.trim().replace(/\)$/, ""))
                                  .map((word) => word.split("/")[1] || word);

                                let renderedCount = 0; // Counter for rendered spans

                                return (
                                  <div
                                    key={index}
                                    className="flex gap-2 flex-wrap"
                                  >
                                    {words.map((word, subIndex) => {
                                      if (
                                        renderedCount < 2 &&
                                        !/[a-z0-9)]\s*\(/i.test(word) &&
                                        !/\)\s*[a-z0-9]/i.test(word) &&
                                        word.toLowerCase().indexOf("see") ===
                                          -1 &&
                                        !word.includes("&")
                                      ) {
                                        renderedCount++;
                                        return (
                                          <span
                                            onClick={() =>
                                              setWord(cleanHTML(word))
                                            }
                                            key={subIndex}
                                            className="cursor-pointer flex py-2 px-4 rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                                          >
                                            {cleanHTML(word)}
                                          </span>
                                        );
                                      }
                                      return null;
                                    })}
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="flex py-2 px-4 rounded-md bg-purple-100">
                                  🤔
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Nothing found!</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Alert className="mt-4">
                <AlertTitle className="">Oopsie...</AlertTitle>
                <AlertDescription className="">
                  This word is not in the dictionary. Try to correct the
                  spelling
                </AlertDescription>
              </Alert>
            )
          ) : null}
        </div>
      </div>
    </>
  );
}
