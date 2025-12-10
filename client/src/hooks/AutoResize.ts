const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";              // сбрасываем текущую высоту
    e.target.style.height = e.target.scrollHeight + "px"; // ставим высоту по контенту
};