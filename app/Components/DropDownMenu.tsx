import { ObjectType } from "./EditMode/EditBar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from 'lucide-react';


export function DropDownMenu({ObjectList, setSelectedObjectType} : {ObjectList: ObjectType[], setSelectedObjectType: (objectType: ObjectType) => void}) {
    return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Question</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {ObjectList.map((objectType) => (
              <DropdownMenuItem key={objectType.type.name} onSelect={() => setSelectedObjectType(objectType)}>
                <objectType.icon className="mr-2 h-4 w-4" />
                <span>{objectType.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
    )
}