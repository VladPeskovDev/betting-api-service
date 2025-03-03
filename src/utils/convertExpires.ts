
//меняем стринг на намбер и переводим в секунды как по тз
export function convertExpiresToSeconds(input: string): number {
    if (input.endsWith("s")) {
      return parseInt(input.replace("s", ""), 10);
    }
    if (input.endsWith("h")) {
      const hours = parseInt(input.replace("h", ""), 10);
      return hours * 3600;
    }
    return 3600; 
  }
  