import { ObjectType } from "./EditBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";

export function DropDownMenu({
  ObjectList,
  setSelectedObjectType,
  label,
}: {
  ObjectList: ObjectType[];
  setSelectedObjectType: (objectType: ObjectType) => void;
  label: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-3 shadow-lg transform hover:scale-105 transition-all duration-200 ease-out text-lg font-semibold">
          <Plus className="h-6 w-6" />
          <span>{label}</span>
          <ChevronDown className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white rounded-lg shadow-xl p-2 mt-2">
        {ObjectList.map((objectType) => (
          <DropdownMenuItem
            key={objectType.type.name}
            onSelect={() => setSelectedObjectType(objectType)}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <objectType.icon className="h-5 w-5 text-blue-800" />
            <span className="text-gray-700 font-medium">{objectType.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
