import java.util.Scanner;
import java.util.Vector;

public class name {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int num;
            String word;
            String duplicate;

            num = scanner.nextInt();

            Vector<String> words = new Vector<String>();

            for (int i=0; i<num; i++) {
                word = scanner.nextLine();
                words.add(word);
            }

            int j = 0;
            duplicate = words.elementAt(0);
            String next;
            int duplicate_size;
            int next_size;
            
            while (j<words.size()) {
                if (j+1 < words.size()) {
                    duplicate_size = duplicate.length();
                    next = words.elementAt(j+1);
                    next_size = next.length();

                    if (next_size > duplicate_size) {
                        duplicate = next;
                    }
                }
                j++;
            }

            System.out.print("LONGEST WORD : ");
            System.out.println(duplicate);
        }
    }
}
