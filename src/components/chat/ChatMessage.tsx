
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

// Simple Markdown to HTML converter
export const markdownToHtml = (markdown: string): string => {
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br>');
  
  // Convert lists
  const listMatch = html.match(/- (.*?)(?=<br>- |$)/gs);
  if (listMatch) {
    listMatch.forEach(match => {
      const listItems = match.split('<br>- ').map(item => 
        `<li>${item.replace('- ', '')}</li>`
      ).join('');
      html = html.replace(match, `<ul>${listItems}</ul>`);
    });
  }
  
  // Convert tables
  const tableRegex = /\|(.+)\|[\r\n]+\|([-:| ]+)\|[\r\n]+((?:\|.+\|[\r\n]+)+)/g;
  let tableMatch;
  while ((tableMatch = tableRegex.exec(markdown)) !== null) {
    const headers = tableMatch[1].split('|').map(header => header.trim());
    const rows = tableMatch[3].trim().split('\n');
    
    let tableHtml = '<table class="border-collapse w-full my-4"><thead><tr>';
    headers.forEach(header => {
      tableHtml += `<th class="border px-4 py-2 bg-gray-100">${header}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';
    
    rows.forEach(row => {
      const cells = row.split('|').filter(cell => cell.trim() !== '');
      tableHtml += '<tr>';
      cells.forEach(cell => {
        tableHtml += `<td class="border px-4 py-2">${cell.trim()}</td>`;
      });
      tableHtml += '</tr>';
    });
    
    tableHtml += '</tbody></table>';
    html = html.replace(tableMatch[0], tableHtml);
  }
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
  
  return html.replace(/<br><br><ul>/g, '<ul>');
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The message has been copied to your clipboard.",
    });
  };

  const addToReport = (content: string) => {
    toast({
      title: "Added to report",
      description: "This insight has been added to your report.",
    });
    // In a real app, this would call an API to add the insight to a report
  };

  return (
    <div
      className={cn(
        "flex flex-col max-w-[80%] rounded-lg p-3",
        message.role === "user"
          ? "bg-primary text-primary-foreground self-end"
          : "bg-muted self-start"
      )}
    >
      <div 
        className={cn(
          "prose prose-sm max-w-none text-left",
          message.role === "agent" && "prose-headings:mt-2 prose-headings:mb-2 prose-p:my-1 prose-li:my-0"
        )}
        dangerouslySetInnerHTML={
          message.role === "agent" 
            ? { __html: markdownToHtml(message.content) } 
            : { __html: message.content }
        }
      />
      
      {message.role === "agent" && (
        <div className="flex gap-2 mt-2 self-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2"
            onClick={() => copyToClipboard(message.content)}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2"
            onClick={() => addToReport(message.content)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add to Report
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2"
            onClick={() => addToReport(message.content)}
          >
            <FileText className="h-3 w-3 mr-1" />
            Save to Report
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
