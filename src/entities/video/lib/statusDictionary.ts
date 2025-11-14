export const statusDictionary = {
    queued: "В очереди",
    drafting: "Создаём черновик",
    draft_review: "Ожидает подтверждения",
    assets: "Готовим визуальные ассеты",
    audio: "Работаем над озвучкой",
    subtitle_review: "Проверяем субтитры",
    rendering: "Рендерим видео",
    ready: "Готово",
    error: "Ошибка",
} as const;

export const messageDictionary = {
    "Job enqueued": "Задача поставлена в очередь",
    "Drafted storyboard via Gemini": "Черновик создан через Gemini",
    "Awaiting storyboard approval": "Ожидаем подтверждения сценария",
    "Storyboard approved. Queued for asset build-out":
        "Сценарий подтверждён. Готовим ассеты",
    "Preparing visual asset prompts": "Создаём визуальные подсказки",
    "Creating voiceover script and music plan":
        "Подготавливаем текст озвучки и музыку",
    "Awaiting subtitle approval": "Ожидаем подтверждения субтитров",
    "Subtitles approved. Queued for rendering":
        "Субтитры подтверждены. Запускаем рендер",
    "Building final reel manifest": "Формируем финальный ролик",
    "Video is ready for download": "Видео готово к загрузке",
} as const;

export type StatusKey = keyof typeof statusDictionary;
export type MessageKey = keyof typeof messageDictionary;

export const translateStatus = (status?: string | null) =>
    (status && statusDictionary[status as StatusKey]) ?? status ?? "—";

export const translateMessage = (message?: string | null) =>
    (message && messageDictionary[message as MessageKey]) ?? message ?? "";
