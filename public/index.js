function updateNoteFn(i)
{
    document.getElementById("notelement"+i).setAttribute("hidden", true);
    document.getElementById("btnNoteTrash"+i).setAttribute("hidden", true);
    document.getElementById("btnNotePen"+i).setAttribute("hidden", true);
    document.getElementById("btnsubmit"+i).removeAttribute("hidden");
    document.getElementById("text"+i).removeAttribute("hidden");
}