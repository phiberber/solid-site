import { Repl } from 'solid-repl';
import { Link, NavLink } from 'solid-app-router';
import { For, Component, Show, createSignal, createEffect, onCleanup, Suspense } from 'solid-js';

import { Icon } from '@amoutonbrady/solid-heroicons';
import { arrowLeft, arrowRight, chevronDown } from '@amoutonbrady/solid-heroicons/solid';

import Nav from '../components/Nav';
import Markdown from '../components/Markdown';
import type { TutorialDirectory, TutorialDirectoryItem, TutorialProps } from './Tutorial.data';

interface DirectoryProps {
  directory: TutorialDirectory;
  current: TutorialDirectoryItem;
}

const DirectoryMenu: Component<DirectoryProps> = (props) => {
  const [showDirectory, setShowDirectory] = createSignal(false);

  const listener = (event: MouseEvent | KeyboardEvent) => {
    if (event instanceof MouseEvent) {
      return setShowDirectory(false);
    }

    if (event.key === 'Escape') setShowDirectory(false);
  };

  createEffect(() => {
    if (showDirectory()) {
      window.addEventListener('click', listener);
      window.addEventListener('keydown', listener);
    } else {
      window.removeEventListener('click', listener);
      window.removeEventListener('keydown', listener);
    }
  });

  onCleanup(() => {
    window.removeEventListener('click', listener);
    window.removeEventListener('keydown', listener);
  });

  return (
    <div class="z-10 relative">
      <div class="box-border rounded-t border-b-2 border-solid bg-white">
        <button
          class="py-2 px-8 flex flex items-center focus:outline-none space-x-1 group"
          onClick={(e) => {
            e.stopPropagation();
            setShowDirectory(!showDirectory());
          }}
        >
          <div class="flex-grow inline-flex flex-col items-baseline">
            <h3 class="text-xl text-solid leading-none">{props.current?.lessonName}</h3>
            <p class="block text-gray-500 text-md">{props.current?.description}</p>
          </div>

          <Icon
            path={chevronDown}
            class="h-8 -mb-1 transform transition group-hover:translate-y-0.5 duration-300"
            classList={{ 'translate-y-0.5': showDirectory() }}
          />
        </button>
      </div>

      <Show when={showDirectory()}>
        <ul class="block shadow absolute bg-white max-w-[60%] h-[40vh] left-8 overflow-auto shadow-lg divide-y box-border rounded-b">
          <For each={props.directory}>
            {(entry) => (
              <li>
                <NavLink
                  activeClass="bg-blue-50"
                  class="hover:bg-blue-100 p-2 block"
                  href={`/tutorial/${entry.internalName}`}
                >
                  <p class="text-sm font-medium text-gray-900">{entry.lessonName}</p>
                  <p class="text-sm text-gray-500">{entry.description}</p>
                </NavLink>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
};

const Tutorial: Component<TutorialProps> = (props) => {
  return (
    <>
      <Nav showLogo filled />

      <Suspense fallback={<p>Loading...</p>}>
        <div class="grid" style="height: calc(100vh - 80px); grid-template-columns: minmax(40%, 600px) auto">
          <div class="flex flex-col bg-gray-50 h-full overflow-hidden">
            <DirectoryMenu
              current={props.tutorialDirectoryEntry}
              directory={props.tutorialDirectory}
            />

            <Markdown class="p-8 flex-1 max-w-full overflow-auto">{props.markdown}</Markdown>

            <div class="py-3 px-8 flex items-center justify-between border-t-2">
              <Show
                when={props.solved}
                fallback={
                  <Link
                    class="inline-flex py-2 px-3 bg-solid-default hover:bg-solid-mediumm text-white rounded"
                    href={`/tutorial/${props.id}?solved`}
                  >
                    Solve
                  </Link>
                }
              >
                <Link
                  class="inline-flex py-2 px-3 bg-solid-default hover:bg-solid-medium text-white rounded"
                  href={`/tutorial/${props.id}`}
                >
                  Reset
                </Link>
              </Show>

              <div class="flex items-center space-x-4">
                <Link href={props.previousUrl ?? ''} external={!props.previousUrl}>
                  <span class="sr-only">Previous step</span>
                  <Icon
                    path={arrowLeft}
                    class="h-6"
                    classList={{ 'opacity-25': !props.previousUrl }}
                  />
                </Link>

                <Link href={props.nextUrl ?? ''} external={!props.nextUrl}>
                  <span class="sr-only">Next step</span>
                  <Icon
                    path={arrowRight}
                    class="h-6"
                    classList={{ 'opacity-25': !props.nextUrl }}
                  />
                </Link>
              </div>
            </div>
          </div>

          <Repl
            title="Interactive Example"
            height="100%"
            data={`${location.origin}${props.solved ? props.solvedJs : props.js}`}
            isInteractive
            layout="vertical"
            class=""
          />
        </div>
      </Suspense>
    </>
  );
};

export default Tutorial;