import java.util.Scanner;

public class binary {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            String str = scanner.nextLine();

            for (int i=0; i<str.length(); i++){
                if (str.charAt(i)!='1' && str.charAt(i)!='0') {
                    System.out.println("0");
                    break;
                }
                else if (i == str.length()-1) {
                    System.out.println("1");
                }
            }
        }
    }
}
