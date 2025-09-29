import java.util.Scanner;

public class stringrev {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            String word;
            String revword;

            word = scanner.nextLine();
            revword = "";

            for (int i=word.length()-1; i>=0; i--) {
                revword += word.charAt(i);
            }

            System.out.println(revword);
        }
    }
}
