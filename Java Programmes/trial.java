import java.util.Arrays;
import java.util.Scanner;

public class trial {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int total;
            int sub;

            total = scanner.nextInt();
            sub = scanner.nextInt();

            int[] mylist = new int[total];

            for (int i = 0; i < total; i++) {
                mylist[i] = scanner.nextInt();
            }

            // Reverse the subarray
            for (int i = 0; i < sub / 2; i++) {
                int temp = mylist[i];
                mylist[i] = mylist[sub - i - 1];
                mylist[sub - i - 1] = temp;
            }

            // Print the reversed array
            System.out.println(Arrays.toString(mylist));
        }
    }
}
