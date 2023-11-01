# ERH
**InDesign 2024 Enhanced Running Headers** 

I'd like to experiment with writing a UXP script that puts paragraph numbers in running headings.
There is a first working version of the script that is built on Windows 10, and it would be nice if someone tried to run it on macOS.

The script needs to be placed in the UXPScript folder, it is immediately ready to work.
A test document is also attached.

The script does not currently declare any specific rules. The names of paragraph styles and text variables can be anything you like.

The script so far works with text variables based on Paragraph Styles. There was no need to use Character Styles yet.

The script can already be used if it is simply important that next to the title of the chapters of any levels there is an up-to-date number at the top of the page.

On empty pages, the script **removes unnecessary running header**.

If you open the document on another computer where the script is not installed, absolutely nothing will happen. The document will retain its last appearance.

If you need to bring the document to the “standard” view, you just need to reassign parent spreads to all pages.

The script logic checks for the presence of text variables and whether the user has used them on parent spreads.
During operation, the script does not build new or change existing parent spreads, but simply builds new equivalent text frames on each page, following the standard rules and existing parameters.

The script can be run several times in a row, the running headers will be completely rebuilt.
This is convenient when working on a document.

