// import * as math from 'mathjs';
// import AttributePairsEditor from './SliderControlAdv';
// import { obj } from '@/classes/vizobjects/obj';
// import React, { useState, useEffect } from 'react';
// import { getObjectsSelector, useStore } from '@/app/store';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { X } from "lucide-react";

// interface AttributePairGet<T extends obj> {
//     obj: T;
//     symbol: string;
//     get_attribute: (obj: T) => number | undefined;
// }

// export class FunctionStr {
//     functionString: string;
//     symbols: AttributePairGet<obj>[];
    
//     constructor(functionString: string, symbols: AttributePairGet<obj>[]) {
//         this.functionString = functionString;
//         this.symbols = symbols;
//     }

//     get_function(): (x: number) => number {
//         return this.parseFunction(this.functionString)
//     }
    
//     private parseFunction(functionString: string): (x: number) => number {
//         try {
//             const scope: { [key: string]: number} = {};

//             // Add symbols to the scope
//             this.symbols.forEach(symbol => {
//                 scope[symbol.symbol] = symbol.get_attribute(symbol.obj) || 0;
//                 }
//             );

//             // Create a function that updates the scope and evaluates the expression
//             return (x: number) => {
//                 scope.x = x;
//                 // Update symbol values in the scope
//                 this.symbols.forEach(symbol => {
//                     scope[symbol.symbol] = symbol.get_attribute(symbol.obj) || 0;
//                 });

//                 return math.evaluate(functionString, scope);
//             };
//         } catch (error) {
//             console.error(`Error parsing function: ${error}`);
//             return (x: number) => x; // Return the identity function if there's an error
//         }
//     }
// }

// interface FunctionStrEditorProps {
//     value: FunctionStr;
//     onChange: (value: FunctionStr) => void;
// }

// export const FunctionStrEditor: React.FC<FunctionStrEditorProps> = ({ value, onChange }) => {
//     const [functionString, setFunctionString] = useState(value.functionString);
//     const [symbols, setSymbols] = useState(value.symbols);

//     const objects: obj[] = useStore(getObjectsSelector);

//     useEffect(() => {
//         onChange(new FunctionStr(functionString, symbols));
//     }, [functionString, symbols, onChange]);

//     const updateSymbol = (index: number, updates: Partial<AttributePairGet<obj>>) => {
//         const newSymbols = symbols.map((symbol, i) => 
//             i === index ? { ...symbol, ...updates } : symbol
//         );
//         setSymbols(newSymbols);
//     };

//     const addSymbol = () => {
//         setSymbols([...symbols, { obj: {} as obj, symbol: '', get_attribute: () => undefined }]);
//     };

//     const removeSymbol = (index: number) => {
//         setSymbols(symbols.filter((_, i) => i !== index));
//     };

//     return (
//         <div className="space-y-4">
//             <Input
//                 type="text"
//                 value={functionString}
//                 onChange={(e) => setFunctionString(e.target.value)}
//                 placeholder="Function string (e.g., 2*x + sin(y))"
//                 className="w-full"
//             />
//             {symbols.map((symbol, index) => (
//                 <div key={index} className="flex items-center space-x-2">
//                     <div className="flex-grow space-y-2">
//                         <Input
//                             type="text"
//                             value={symbol.symbol}
//                             onChange={(e) => updateSymbol(index, { symbol: e.target.value })}
//                             placeholder="Symbol (e.g., y)"
//                             className="w-full"
//                         />
//                         <Select
//                             value={symbol.obj.id?.toString()}
//                             onValueChange={(value) => {
//                                 const selectedObj = objects.find(obj => obj.id.toString() === value);
//                                 if (selectedObj) {
//                                     updateSymbol(index, { obj: selectedObj });
//                                 }
//                             }}
//                         >
//                             <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select object" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {objects.map((obj) => (
//                                     <SelectItem key={obj.id} value={obj.id.toString()}>
//                                         {obj.name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                         {symbol.obj.id && (
//                             <Select
//                                 value={symbol.get_attribute.toString()}
//                                 onValueChange={(value) => {
//                                     const selectedAttr = symbol.obj.get_set_att_selector('number').find(attr => attr.toString() === value);
//                                     if (selectedAttr) {
//                                         updateSymbol(index, { get_attribute: selectedAttr.get_attribute });
//                                     }
//                                 }}
//                             >
//                                 <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Select attribute" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {symbol.obj.get_set_att_selector('number').map((attr, attrIndex) => (
//                                         <SelectItem key={attrIndex} value={attr.toString()}>
//                                             {attr.toString()}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         )}
//                     </div>
//                     <Button
//                         onClick={() => removeSymbol(index)}
//                         variant="ghost"
//                         size="icon"
//                         className="self-center"
//                     >
//                         <X className="h-4 w-4" />
//                     </Button>
//                 </div>
//             ))}
//             <Button
//                 onClick={addSymbol}
//                 variant="outline"
//                 className="w-full mt-3"
//             >
//                 Add Symbol
//             </Button>
//         </div>
//     );
// };